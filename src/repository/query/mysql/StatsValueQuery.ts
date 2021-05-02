import { Kind, Nullable } from '@jamashita/anden-type';
import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Chrono, Superposition } from '@jamashita/genitore';
import { ImmutableProject, MutableProject, MutableSequence, Project, Sequence } from '@jamashita/lluvia-collection';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { StatsItemError } from '../../../domain/vo/StatsItem/error/StatsItemError';
import { StatsItemID } from '../../../domain/vo/StatsItem/StatsItemID';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { StatsValueError } from '../../../domain/vo/StatsValue/error/StatsValueError';
import { StatsValue, StatsValueRow } from '../../../domain/vo/StatsValue/StatsValue';
import { StatsValues } from '../../../domain/vo/StatsValue/StatsValues';
import { IStatsValueQuery } from '../interface/IStatsValueQuery';
import { IMySQLQuery } from './IMySQLQuery';

@injectable()
export class StatsValueQuery implements IStatsValueQuery<MySQLError>, IMySQLQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public findByStatsID(
    statsID: StatsID
  ): Superposition<Project<StatsItemID, StatsValues>, MySQLError | StatsValueError> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`;

    return Superposition.playground<Array<StatsValueRow>, MySQLError>(() => {
      return this.mysql.execute<Array<StatsValueRow>>(query, {
        statsID: statsID.get().get()
      });
    }, MySQLError).map<Project<StatsItemID, StatsValues>, MySQLError | StatsItemError | StatsValueError>((rows: Array<StatsValueRow>) => {
      return this.engage(rows);
    }).recover<Project<StatsItemID, StatsValues>, MySQLError | StatsValueError>((err: MySQLError | StatsItemError | StatsValueError) => {
      if (err instanceof StatsItemError) {
        throw new StatsValueError('StatsValueQuery.findByStatsID()', err);
      }

      throw err;
    }, StatsValueError, MySQLError);
  }

  private engage(rows: Array<StatsValueRow>): Superposition<Project<StatsItemID, StatsValues>, StatsItemError> {
    return Superposition.of<Project<StatsItemID, StatsValues>, StatsItemError>((chrono: Chrono<Project<StatsItemID, StatsValues>, StatsItemError>) => {
      const p1: MutableProject<StatsItemID, MutableSequence<StatsValue>> = MutableProject.empty<StatsItemID, MutableSequence<StatsValue>>();
      let abort: boolean = false;

      rows.forEach((row: StatsValueRow) => {
        if (abort) {
          return;
        }

        try {
          const statsItemID: StatsItemID = StatsItemID.ofString(row.statsItemID);
          const value: StatsValue = StatsValue.ofRow(row);
          const sequence: Nullable<MutableSequence<StatsValue>> = p1.get(statsItemID);

          if (Kind.isNull(sequence)) {
            p1.set(statsItemID, MutableSequence.ofArray<StatsValue>([value]));

            return;
          }

          sequence.add(value);
        }
        catch (err: unknown) {
          if (err instanceof StatsItemError) {
            abort = true;
            chrono.decline(err);

            return;
          }
          abort = true;
          chrono.throw(err);
        }
      });

      let p2: ImmutableProject<StatsItemID, StatsValues> = ImmutableProject.empty<StatsItemID, StatsValues>();

      p1.forEach((sequence: Sequence<StatsValue>, statsItemID: StatsItemID) => {
        p2 = p2.set(statsItemID, StatsValues.ofArray(sequence.toArray()));
      });

      chrono.accept(p2);
    }, StatsItemError);
  }
}

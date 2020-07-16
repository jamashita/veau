import { inject, injectable } from 'inversify';

import { ImmutableProject, Project } from '@jamashita/publikum-collection';
import { Epoque, Superposition } from '@jamashita/publikum-monad';
import { IMySQL, MySQLError } from '@jamashita/publikum-mysql';
import { Ambiguous, Kind } from '@jamashita/publikum-type';

import { Type } from '../../Container/Types';
import { StatsItemIDError } from '../../VO/StatsItem/Error/StatsItemIDError';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValuesError } from '../../VO/StatsValue/Error/StatsValuesError';
import { StatsValueRow } from '../../VO/StatsValue/StatsValue';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

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
  ): Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | MySQLError> {
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
    }, MySQLError)
      .map<Project<StatsItemID, StatsValues>, StatsItemIDError | StatsValuesError>((rows: Array<StatsValueRow>) => {
        return this.engage(rows).map<Project<StatsItemID, StatsValues>, StatsItemIDError | StatsValuesError>(
          (map: Map<StatsItemID, StatsValues>) => {
            return ImmutableProject.of(map);
          }
        );
      })
      .recover<Project<StatsItemID, StatsValues>, StatsValuesError | MySQLError>(
        (err: StatsItemIDError | StatsValuesError | MySQLError) => {
          if (err instanceof StatsItemIDError) {
            throw new StatsValuesError('StatsValueQuery.findByStatsID()', err);
          }

          throw err;
        },
        StatsValuesError,
        MySQLError
      );
  }

  private engage(
    rows: Array<StatsValueRow>
  ): Superposition<Map<StatsItemID, StatsValues>, StatsItemIDError | StatsValuesError> {
    const map1: Map<string, Array<StatsValueRow>> = new Map<string, Array<StatsValueRow>>();

    rows.forEach((row: StatsValueRow) => {
      const value: Ambiguous<Array<StatsValueRow>> = map1.get(row.statsItemID);

      if (Kind.isUndefined(value)) {
        map1.set(row.statsItemID, [row]);

        return;
      }

      value.push(row);
    });

    const map2: Map<StatsItemID, StatsValues> = new Map<StatsItemID, StatsValues>();

    return Superposition.of<Map<StatsItemID, StatsValues>, StatsItemIDError | StatsValuesError>(
      (epoque: Epoque<Map<StatsItemID, StatsValues>, StatsItemIDError | StatsValuesError>) => {
        map1.forEach((r: Array<StatsValueRow>, id: string) => {
          StatsItemID.ofString(id)
            .map<void, StatsItemIDError | StatsValuesError>((itemID: StatsItemID) => {
              return StatsValues.ofRow(r).map<void, StatsValuesError>((values: StatsValues) => {
                map2.set(itemID, values);

                if (map1.size === map2.size) {
                  epoque.accept(map2);
                }
              });
            }, StatsValuesError)
            .recover<void, Error>((err: StatsItemIDError | StatsValuesError) => {
              epoque.decline(err);
            });
        });
      }
    );
  }
}

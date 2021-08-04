import { DataSourceError } from '@jamashita/catacombe-datasource';
import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Superposition } from '@jamashita/genitore-superposition';
import { Project } from '@jamashita/lluvia-project';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { StatsItemRow } from '../../../domain/entity/StatsItem/StatsItem.js';
import { StatsItems } from '../../../domain/entity/StatsItem/StatsItems.js';
import { StatsItemError } from '../../../domain/vo/StatsItem/error/StatsItemError.js';
import { StatsItemID } from '../../../domain/vo/StatsItem/StatsItemID.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { StatsValueError } from '../../../domain/vo/StatsValue/error/StatsValueError.js';
import { StatsValues } from '../../../domain/vo/StatsValue/StatsValues.js';
import { IStatsItemQuery } from '../IStatsItemQuery.js';
import { IStatsValueQuery } from '../IStatsValueQuery.js';
import { IMySQLQuery } from './IMySQLQuery.js';

@injectable()
export class StatsItemMySQLQuery implements IStatsItemQuery<MySQLError>, IMySQLQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;
  private readonly statsValueQuery: IStatsValueQuery;

  public constructor(
    @inject(Type.MySQL) mysql: IMySQL,
    @inject(Type.StatsValueMySQLQuery) statsValueQuery: IStatsValueQuery
  ) {
    this.mysql = mysql;
    this.statsValueQuery = statsValueQuery;
  }

  public findByStatsID(statsID: StatsID): Superposition<StatsItems, MySQLError | StatsItemError> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`;

    return Superposition.playground<Array<StatsItemRow>, MySQLError>(() => {
      return this.mysql.execute<Array<StatsItemRow>>(query, {
        statsID: statsID.get().get()
      });
    }, MySQLError).map<StatsItems, DataSourceError | StatsItemError | StatsValueError>((rows: Array<StatsItemRow>) => {
      return this.statsValueQuery.findByStatsID(statsID).map<StatsItems, DataSourceError | StatsItemError | StatsValueError>((values: Project<StatsItemID, StatsValues>) => {
        return StatsItems.ofRow(rows, values);
      }, StatsItemError);
    }).recover<StatsItems, MySQLError | StatsItemError>((err: DataSourceError | StatsItemError | StatsValueError) => {
      if (err instanceof MySQLError || err instanceof StatsItemError) {
        throw err;
      }

      throw new StatsItemError('StatsItemMySQLQuery.findByStatsID()', err);
    }, StatsItemError, MySQLError);
  }
}

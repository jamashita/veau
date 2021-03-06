import { Project } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { IMySQL, MySQLError } from '@jamashita/publikum-mysql';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { StatsItemRow } from '../../Entity/StatsItem/StatsItem';
import { StatsItems } from '../../Entity/StatsItem/StatsItems';
import { StatsItemError } from '../../VO/StatsItem/Error/StatsItemError';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValueError } from '../../VO/StatsValue/Error/StatsValueError';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

@injectable()
export class StatsItemQuery implements IStatsItemQuery<MySQLError>, IMySQLQuery {
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

  public findByStatsID(statsID: StatsID): Superposition<StatsItems, StatsItemError | MySQLError> {
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
    }, MySQLError).map<StatsItems, StatsValueError | StatsItemError | DataSourceError>((rows: Array<StatsItemRow>) => {
      return this.statsValueQuery.findByStatsID(statsID).map<StatsItems, StatsValueError | StatsItemError | DataSourceError>((values: Project<StatsItemID, StatsValues>) => {
        return StatsItems.ofRow(rows, values);
      }, StatsItemError);
    }).recover<StatsItems, StatsItemError | MySQLError>((err: StatsValueError | StatsItemError | DataSourceError) => {
      if (err instanceof MySQLError || err instanceof StatsItemError) {
        throw err;
      }

      throw new StatsItemError('StatsItemQuery.findByStatsID()', err);
    }, StatsItemError, MySQLError);
  }
}

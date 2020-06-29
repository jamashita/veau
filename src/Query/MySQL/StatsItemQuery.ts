import { inject, injectable } from 'inversify';

import { Project } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { IMySQL, MySQLError } from '@jamashita/publikum-mysql';

import { Type } from '../../Container/Types';
import { StatsItemRow } from '../../Entity/StatsItem/StatsItem';
import { StatsItems } from '../../Entity/StatsItem/StatsItems';
import { StatsItemsError } from '../../VO/StatsItem/Error/StatsItemsError';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsValuesError } from '../../VO/StatsValue/Error/StatsValuesError';
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

  public findByStatsID(statsID: StatsID): Superposition<StatsItems, StatsItemsError | MySQLError> {
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
    }).map<StatsItems, StatsItemsError | MySQLError>((rows: Array<StatsItemRow>) => {
      return this.statsValueQuery.findByStatsID(statsID).transform<StatsItems, StatsItemsError | MySQLError>(
        (values: Project<StatsItemID, StatsValues>) => {
          return StatsItems.ofRow(rows, values);
        },
        (err: StatsValuesError | DataSourceError) => {
          if (err instanceof MySQLError) {
            throw err;
          }

          throw new StatsItemsError('STATS VALUES ERROR', err);
        }
      );
    });
  }
}

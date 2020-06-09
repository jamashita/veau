import { inject, injectable } from 'inversify';

import { Project } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
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
export class StatsItemQuery implements IStatsItemQuery, IMySQLQuery {
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

  public async findByStatsID(statsID: StatsID): Promise<Superposition<StatsItems, StatsItemsError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`;

    const superposition1: Superposition<Array<StatsItemRow>, MySQLError> = await Schrodinger.sandbox<
      Array<StatsItemRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<StatsItemRow>>(query, {
        statsID: statsID.get().get()
      });
    });

    return superposition1.transform<StatsItems, StatsItemsError | DataSourceError>(
      async (rows: Array<StatsItemRow>) => {
        const superposition2: Superposition<
          Project<StatsItemID, StatsValues>,
          StatsValuesError | DataSourceError
        > = await this.statsValueQuery.findByStatsID(statsID);

        return superposition2.transform<StatsItems, StatsItemsError | DataSourceError>(
          (project: Project<StatsItemID, StatsValues>) => {
            return StatsItems.ofRow(rows, project);
          },
          (err: StatsValuesError | DataSourceError) => {
            if (err instanceof DataSourceError) {
              return Dead.of<StatsItems, DataSourceError>(err);
            }

            return Dead.of<StatsItems, StatsItemsError>(new StatsItemsError('STATS VALUES ERROR', err));
          }
        );
      },
      (err: MySQLError) => {
        return Promise.resolve<Superposition<StatsItems, MySQLError>>(Dead.of<StatsItems, MySQLError>(err));
      }
    );
  }
}

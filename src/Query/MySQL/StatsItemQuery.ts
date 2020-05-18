import { inject, injectable } from 'inversify';
import { DataSourceError, Dead, IMySQL, MySQLError, Project, Schrodinger, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { StatsItemRow } from '../../Entity/StatsItem';
import { StatsItems } from '../../Entity/StatsItems';
import { StatsItemsError } from '../../Error/StatsItemsError';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { StatsID } from '../../VO/StatsID';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsValues } from '../../VO/StatsValues';
import { IMySQLQuery } from '../Interface/IMySQLQuery';
import { IStatsItemQuery } from '../Interface/IStatsItemQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';

@injectable()
export class StatsItemQuery implements IStatsItemQuery, IMySQLQuery {
  public readonly noun: 'StatsItemQuery' = 'StatsItemQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;
  private readonly statsValueQuery: IStatsValueQuery;

  public constructor(
    @inject(TYPE.MySQL) mysql: IMySQL,
    @inject(TYPE.StatsValueMySQLQuery) statsValueQuery: IStatsValueQuery
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

    const superposition1: Superposition<Array<StatsItemRow>, MySQLError> = await Schrodinger.playground<
      Array<StatsItemRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<StatsItemRow>>(query, {
        statsID: statsID.get().get()
      });
    });

    return superposition1.match<StatsItems, StatsItemsError | DataSourceError>(
      async (rows: Array<StatsItemRow>) => {
        const superposition2: Superposition<
          Project<StatsItemID, StatsValues>,
          StatsValuesError | DataSourceError
        > = await Schrodinger.playground<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>(() => {
          return this.statsValueQuery.findByStatsID(statsID);
        });

        return superposition2.match<StatsItems, StatsItemsError | DataSourceError>(
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

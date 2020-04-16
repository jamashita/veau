import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { StatsItemRow } from '../../Entity/StatsItem';
import { StatsItems } from '../../Entity/StatsItems';
import { StatsItemsError } from '../../Error/StatsItemsError';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { DataSourceError } from '../../General/DataSourceError';
import { IMySQL } from '../../General/MySQL/Interface/IMySQL';
import { MySQLError } from '../../General/MySQL/MySQLError';
import { Failure } from '../../General/Superposition/Failure';
import { Superposition } from '../../General/Superposition/Superposition';
import { StatsID } from '../../VO/StatsID';
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

    try {
      const statsItemRows: Array<StatsItemRow> = await this.mysql.execute<Array<StatsItemRow>>(
        query,
        {
          statsID: statsID.get().get()
        }
      );

      const trial: Superposition<StatsValues, StatsValuesError | DataSourceError> = await this.statsValueQuery.findByStatsID(statsID);

      return trial.match<StatsItems, StatsItemsError | DataSourceError>((statsValues: StatsValues) => {
        return StatsItems.ofRow(statsItemRows, statsValues);
      }, (err: StatsValuesError | DataSourceError) => {
        if (err instanceof DataSourceError) {
          return Failure.of<StatsItems, DataSourceError>(err);
        }

        return Failure.of<StatsItems, StatsItemsError>(new StatsItemsError('STATS VALUES ERROR', err));
      });
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<StatsItems, MySQLError>(err);
      }

      throw err;
    }
  }
}

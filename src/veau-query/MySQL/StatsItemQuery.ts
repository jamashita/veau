import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { StatsItemRow } from '../../veau-entity/StatsItem';
import { StatsItems } from '../../veau-entity/StatsItems';
import { StatsItemsError } from '../../veau-error/StatsItemsError';
import { StatsValuesError } from '../../veau-error/StatsValuesError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { IMySQL } from '../../veau-general/MySQL/interfaces/IMySQL';
import { MySQLError } from '../../veau-general/MySQL/MySQLError';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValues } from '../../veau-vo/StatsValues';
import { IMySQLQuery } from '../interfaces/IMySQLQuery';
import { IStatsItemQuery } from '../interfaces/IStatsItemQuery';
import { IStatsValueQuery } from '../interfaces/IStatsValueQuery';

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

  public async findByStatsID(statsID: StatsID): Promise<Try<StatsItems, StatsItemsError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`;

    try {
      const statsItemRows: Array<StatsItemRow> = await this.mysql.execute<Array<StatsItemRow>>(query, {
        statsID: statsID.get().get()
      });

      const trial: Try<StatsValues, StatsValuesError | DataSourceError> = await this.statsValueQuery.findByStatsID(statsID);

      return trial.match<Try<StatsItems, StatsItemsError | DataSourceError>>((statsValues: StatsValues) => {
        return StatsItems.ofRow(statsItemRows, statsValues);
      }, (err: StatsValuesError | DataSourceError, self: Failure<StatsValues, StatsValuesError | DataSourceError>) => {
        if (err instanceof DataSourceError) {
          return self.transpose<StatsItems>();
        }

        return Failure.of<StatsItems, StatsItemsError>(new StatsItemsError(err.message));
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

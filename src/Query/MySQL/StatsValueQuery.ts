import { inject, injectable } from 'inversify';
import { DataSourceError, Dead, IMySQL, MySQLError, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { StatsID } from '../../VO/StatsID';
import { StatsValueRow } from '../../VO/StatsValue';
import { StatsValues } from '../../VO/StatsValues';
import { IMySQLQuery } from '../Interface/IMySQLQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';

@injectable()
export class StatsValueQuery implements IStatsValueQuery, IMySQLQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async findByStatsID(statsID: StatsID): Promise<Superposition<StatsValues, StatsValuesError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`;

    try {
      const statsValueRows: Array<StatsValueRow> = await this.mysql.execute<Array<StatsValueRow>>(
        query,
        {
          statsID: statsID.get().get()
        }
      );

      return StatsValues.ofRow(statsValueRows);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<StatsValues, MySQLError>(err);
      }

      throw err;
    }
  }
}

import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { DataSourceError } from '../../General/DataSourceError';
import { IMySQL } from '../../General/MySQL/Interface/IMySQL';
import { MySQLError } from '../../General/MySQL/MySQLError';
import { Failure } from '../../General/Try/Failure';
import { Try } from '../../General/Try/Try';
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

  public async findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`;

    try {
      const statsValueRows: Array<StatsValueRow> = await this.mysql.execute<Array<StatsValueRow>>(query, {
        statsID: statsID.get().get()
      });

      return StatsValues.ofRow(statsValueRows);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<StatsValues, MySQLError>(err);
      }

      throw err;
    }
  }
}

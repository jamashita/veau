import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { StatsValuesError } from '../../veau-error/StatsValuesError';
import { IMySQL } from '../../veau-general/MySQL/interfaces/IMySQL';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValueRow } from '../../veau-vo/StatsValue';
import { StatsValues } from '../../veau-vo/StatsValues';
import { IMySQLQuery } from '../interfaces/IMySQLQuery';
import { IStatsValueQuery } from '../interfaces/IStatsValueQuery';

@injectable()
export class StatsValueQuery implements IStatsValueQuery, IMySQLQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async findByStatsID(statsID: StatsID): Promise<Try<StatsValues, StatsValuesError>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`;

    const statsValueRows: Array<StatsValueRow> = await this.mysql.execute<Array<StatsValueRow>>(query, {
      statsID: statsID.get()
    });

    return StatsValues.ofRow(statsValueRows);
  }
}

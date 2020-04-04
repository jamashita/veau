import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { StatsValuesError } from '../veau-error/StatsValuesError';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { Try } from '../veau-general/Try/Try';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValueRow } from '../veau-vo/StatsValue';
import { StatsValues } from '../veau-vo/StatsValues';

@injectable()
export class StatsValueQuery {
  private mysql: MySQL;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL) {
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

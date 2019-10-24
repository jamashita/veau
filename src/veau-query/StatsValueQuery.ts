import { inject, injectable } from 'inversify';
import moment from 'moment';
import { TYPE } from '../veau-container/Types';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue, StatsValueRow } from '../veau-vo/StatsValue';
import { StatsValues } from '../veau-vo/StatsValues';

@injectable()
export class StatsValueQuery {
  private mysql: MySQL;

  public constructor(
    @inject(TYPE.MySQL) mysql: MySQL
  ) {
    this.mysql = mysql;
  }

  public async findByStatsID(statsID: StatsID): Promise<Map<string, StatsValues>> {
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

    const valueMap: Map<string, StatsValues> = new Map<string, StatsValues>();

    statsValueRows.forEach((statsValueRow: StatsValueRow): void => {
      const {
        statsItemID,
        asOf,
        value
      } = statsValueRow;

      const statsValue: StatsValue = StatsValue.of(moment(asOf), value);
      const statsValues: StatsValues | undefined = valueMap.get(statsItemID);

      if (statsValues !== undefined) {
        valueMap.set(statsItemID, statsValues.set(statsValue));
        return;
      }

      valueMap.set(statsItemID, StatsValues.of([
        statsValue
      ]));
    });

    return valueMap;
  }
}

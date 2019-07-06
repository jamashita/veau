import * as moment from 'moment';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsValues } from '../veau-vo/collection/StatsValues';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue, StatsValueRow } from '../veau-vo/StatsValue';

export class StatsValueQuery {
  private static instance: StatsValueQuery = new StatsValueQuery();

  public static getInstance(): StatsValueQuery {
    return StatsValueQuery.instance;
  }

  private constructor() {
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

    const statsValueRows: Array<StatsValueRow> = await veauMySQL.execute(query, {
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

      if (statsValues) {
        valueMap.set(statsItemID, statsValues.set(statsValue));
        return;
      }

      valueMap.set(statsItemID, new StatsValues([
        statsValue
      ]));
    });

    return valueMap;
  }
}

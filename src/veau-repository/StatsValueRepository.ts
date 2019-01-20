import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue, StatsValueRow } from '../veau-vo/StatsValue';

export class StatsValueRepository implements IStatsValueRepository {
  private static instance: StatsValueRepository = new StatsValueRepository();

  public static getInstance(): StatsValueRepository {
    return StatsValueRepository.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Map<string, Array<StatsValue>>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`;

    const statsValueRows: Array<StatsValueRow> = await VeauMySQL.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);

    const valueMap: Map<string, Array<StatsValue>> = new Map();

    statsValueRows.forEach((statsValueRow: StatsValueRow) => {
      const {
        statsItemID,
        asOf,
        value
      } = statsValueRow;

      const statsValue: StatsValue = StatsValue.of(asOf, value);
      const statsValues: Array<StatsValue> | undefined = valueMap.get(statsItemID);

      if (statsValues) {
        statsValues.push(statsValue);
        return;
      }

      valueMap.set(statsItemID, [
        statsValue
      ]);
    });

    return valueMap;
  }
}

export interface IStatsValueRepository {

  findByStatsID(captionID: StatsID): Promise<Map<string, Array<StatsValue>>>;
}

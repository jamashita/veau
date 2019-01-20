import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { CaptionID } from '../veau-vo/CaptionID';
import { StatsValue, StatsValueRow } from '../veau-vo/StatsValue';

export class StatsValueRepository implements IStatsValueRepository {
  private static instance: StatsValueRepository = new StatsValueRepository();

  public static getInstance(): StatsValueRepository {
    return StatsValueRepository.instance;
  }

  private constructor() {
  }

  public async findByCaptionID(captionID: CaptionID): Promise<Map<string, Array<StatsValue>>> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.caption_id = :captionID;`;

    const statsValueRows: Array<StatsValueRow> = await VeauMySQL.query(query, [
      {
        captionID: captionID.get().get()
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

  findByCaptionID(captionID: CaptionID): Promise<Map<string, Array<StatsValue>>>;
}

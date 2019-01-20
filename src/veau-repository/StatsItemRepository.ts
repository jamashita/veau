import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { CaptionID } from '../veau-vo/CaptionID';
import { StatsItem, StatsItemRow } from '../veau-vo/StatsItem';

export class StatsItemRepository implements IStatsItemRepository {
  private static instance: StatsItemRepository = new StatsItemRepository();

  public static getInstance(): StatsItemRepository {
    return StatsItemRepository.instance;
  }

  private constructor() {
  }

  public async findByCaptionID(captionID: CaptionID): Promise<Map<string, Array<StatsItem>>> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.caption_id = :captionID;`;

    const statsItems: Array<StatsItemRow> = await VeauMySQL.query(query, [
      {
        captionID: captionID.get().get()
      }
    ]);

    const itemMap: Map<string, Array<StatsItem>> = new Map();

    statsItems.forEach((item: StatsItemRow) => {
      const {
        statsID,
        asOf,
        value
      } = item;

      const statsItem: StatsItem = StatsItem.of(asOf, value);
      const items: Array<StatsItem> | undefined = itemMap.get(statsID);

      if (items) {
        items.push(statsItem);
        return;
      }

      itemMap.set(statsID, [
        statsItem
      ]);
    });

    return itemMap;
  }
}

export interface IStatsItemRepository {

  findByCaptionID(captionID: CaptionID): Promise<Map<string, Array<StatsItem>>>;
}

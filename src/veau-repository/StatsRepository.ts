import {Stats, StatsRow} from '../veau-entity/Stats';
import {StatsFactory} from '../veau-factory/StatsFactory';
import {VeauDB} from '../veau-infrastructure/VeauDB';
import {CaptionID} from '../veau-vo/CaptionID';
import {StatsItem} from '../veau-vo/StatsItem';
import {StatsItemRepository} from './StatsItemRepository';

const statsItemRepository: StatsItemRepository = StatsItemRepository.getInstance();
const statsFactory: StatsFactory = StatsFactory.getInstance();

export class StatsRepository implements IStatsRepository {
  private static instance: StatsRepository = new StatsRepository();

  public static getInstance(): StatsRepository {
    return StatsRepository.instance;
  }

  private constructor() {
  }

  public async findByCaptionID(captionID: CaptionID): Promise<Array<Stats>> {
    const query = `SELECT
      R1.stats_id AS statsID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.seq
      FROM stats R1
      WHERE R1.caption_id = :captionID;`;

    const stats: Array<StatsRow> = await VeauDB.query(query, [
      {
        captionID: captionID.get().get()
      }
    ]);

    const itemMap: Map<string, Array<StatsItem>> = await statsItemRepository.findByCaptionID(captionID);

    return stats.map<Stats>((stats) => {
      const items: Array<StatsItem> | undefined = itemMap.get(stats.statsID);

      if (items) {
        return statsFactory.fromRow(stats, items);
      }

      return statsFactory.fromRow(stats, []);
    });
  }
}

export interface IStatsRepository {

  findByCaptionID(captionID: CaptionID): Promise<Array<Stats>>;
}

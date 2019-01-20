import { Stats, StatsRow } from '../veau-entity/Stats';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { CaptionID } from '../veau-vo/CaptionID';
import { StatsItem } from '../veau-vo/StatsItem';
import { StatsItemRepository } from './StatsItemRepository';

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
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.seq
      FROM stats R1
      WHERE R1.caption_id = :captionID;`;

    const stats: Array<StatsRow> = await VeauMySQL.query(query, [
      {
        captionID: captionID.get().get()
      }
    ]);

    const itemMap: Map<string, Array<StatsItem>> = await statsItemRepository.findByCaptionID(captionID);

    return stats.map<Stats>((piece: StatsRow) => {
      const items: Array<StatsItem> | undefined = itemMap.get(piece.statsID);

      if (items) {
        return statsFactory.fromRow(piece, items);
      }

      return statsFactory.fromRow(piece, []);
    });
  }
}

export interface IStatsRepository {

  findByCaptionID(captionID: CaptionID): Promise<Array<Stats>>;
}

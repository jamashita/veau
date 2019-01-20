import { StatsItem, StatsItemRow } from '../veau-entity/StatsItem';
import { StatsItemFactory } from '../veau-factory/StatsFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/CaptionID';
import { StatsValue } from '../veau-vo/StatsValue';
import { StatsValueRepository } from './StatsValueRepository';

const statsValueRepository: StatsValueRepository = StatsValueRepository.getInstance();
const statsFactory: StatsItemFactory = StatsItemFactory.getInstance();

export class StatsItemRepository implements IStatsItemRepository {
  private static instance: StatsItemRepository = new StatsItemRepository();

  public static getInstance(): StatsItemRepository {
    return StatsItemRepository.instance;
  }

  private constructor() {
  }

  public async findByCaptionID(captionID: StatsID): Promise<Array<StatsItem>> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.seq
      FROM stats R1
      WHERE R1.caption_id = :captionID;`;

    const statsItemRows: Array<StatsItemRow> = await VeauMySQL.query(query, [
      {
        captionID: captionID.get().get()
      }
    ]);

    const valueMap: Map<string, Array<StatsValue>> = await statsValueRepository.findByCaptionID(captionID);

    return statsItemRows.map<StatsItem>((statsItemRow: StatsItemRow) => {
      const values: Array<StatsValue> | undefined = valueMap.get(statsItemRow.statsItemID);

      if (values) {
        return statsFactory.fromRow(statsItemRow, values);
      }

      return statsFactory.fromRow(statsItemRow, []);
    });
  }
}

export interface IStatsItemRepository {

  findByCaptionID(captionID: StatsID): Promise<Array<StatsItem>>;
}

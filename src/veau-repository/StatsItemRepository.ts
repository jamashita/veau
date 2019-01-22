import { StatsItem, StatsItemRow } from '../veau-entity/StatsItem';
import { StatsItemFactory } from '../veau-factory/StatsItemFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { StatsValueRepository } from './StatsValueRepository';

const statsValueRepository: StatsValueRepository = StatsValueRepository.getInstance();
const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();

export class StatsItemRepository implements IStatsItemRepository {
  private static instance: StatsItemRepository = new StatsItemRepository();

  public static getInstance(): StatsItemRepository {
    return StatsItemRepository.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Array<StatsItem>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name,
      R1.unit,
      R1.seq
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`;

    const statsItemRows: Array<StatsItemRow> = await VeauMySQL.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);

    const valueMap: Map<string, Array<StatsValue>> = await statsValueRepository.findByStatsID(statsID);

    return statsItemRows.map<StatsItem>((statsItemRow: StatsItemRow) => {
      const values: Array<StatsValue> | undefined = valueMap.get(statsItemRow.statsItemID);

      if (values) {
        return statsItemFactory.fromRow(statsItemRow, values);
      }

      return statsItemFactory.fromRow(statsItemRow, []);
    });
  }
}

export interface IStatsItemRepository {

  findByStatsID(statsID: StatsID): Promise<Array<StatsItem>>;
}

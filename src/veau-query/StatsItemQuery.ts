import { StatsItem, StatsItemRow } from '../veau-entity/StatsItem';
import { StatsItemFactory } from '../veau-factory/StatsItemFactory';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsValues } from '../veau-vo/collection/StatsValues';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValueQuery } from './StatsValueQuery';

const statsValueQuery: StatsValueQuery = StatsValueQuery.getInstance();
const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();

export class StatsItemQuery {
  private static instance: StatsItemQuery = new StatsItemQuery();

  public static getInstance(): StatsItemQuery {
    return StatsItemQuery.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Array<StatsItem>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`;

    const statsItemRows: Array<StatsItemRow> = await veauMySQL.execute(query, {
      statsID: statsID.get()
    });

    const valueMap: Map<string, StatsValues> = await statsValueQuery.findByStatsID(statsID);

    return statsItemRows.map<StatsItem>((statsItemRow: StatsItemRow) => {
      const values: StatsValues | undefined = valueMap.get(statsItemRow.statsItemID);

      if (values) {
        return statsItemFactory.fromRow(statsItemRow, values);
      }

      return statsItemFactory.fromRow(statsItemRow, new StatsValues([]));
    });
  }
}

import { StatsValues } from '../veau-collection/StatsValues';
import { StatsItem, StatsItemRow } from '../veau-entity/StatsItem';
import { StatsItemFactory } from '../veau-factory/StatsItemFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { IStatsItemQuery } from './interfaces/IStatsItemQuery';
import { StatsValueMySQLQuery } from './StatsValueMySQLQuery';

const statsValueMySQLQuery: StatsValueMySQLQuery = StatsValueMySQLQuery.getInstance();
const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();

export class StatsItemMySQLQuery implements IStatsItemQuery {
  private static instance: StatsItemMySQLQuery = new StatsItemMySQLQuery();

  public static getInstance(): StatsItemMySQLQuery {
    return StatsItemMySQLQuery.instance;
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

    const statsItemRows: Array<StatsItemRow> = await VeauMySQL.execute(query, {
      statsID: statsID.get().get()
    });

    const valueMap: Map<string, StatsValues> = await statsValueMySQLQuery.findByStatsID(statsID);

    return statsItemRows.map<StatsItem>((statsItemRow: StatsItemRow) => {
      const values: StatsValues | undefined = valueMap.get(statsItemRow.statsItemID);

      if (values) {
        return statsItemFactory.fromRow(statsItemRow, values);
      }

      return statsItemFactory.fromRow(statsItemRow, new StatsValues([]));
    });
  }
}

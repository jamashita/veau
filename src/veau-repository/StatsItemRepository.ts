import { StatsValues } from '../veau-collection/StatsValues';
import { StatsItem, StatsItemRow } from '../veau-entity/StatsItem';
import { StatsItemFactory } from '../veau-factory/StatsItemFactory';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { IStatsItemRepository } from './interfaces/IStatsItemRepository';
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
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`;

    const statsItemRows: Array<StatsItemRow> = await VeauMySQL.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);

    const valueMap: Map<string, StatsValues> = await statsValueRepository.findByStatsID(statsID);

    return statsItemRows.map<StatsItem>((statsItemRow: StatsItemRow) => {
      const values: StatsValues | undefined = valueMap.get(statsItemRow.statsItemID);

      if (values) {
        return statsItemFactory.fromRow(statsItemRow, values);
      }

      return statsItemFactory.fromRow(statsItemRow, new StatsValues([]));
    });
  }

  public async create(statsID: StatsID, statsItem: StatsItem, seq: number, transaction: Transaction): Promise<any> {
    const query: string = `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`;

    await transaction.query(query, [
      {
        statsItemID: statsItem.getStatsItemID().get().get(),
        statsID: statsID.get().get(),
        name: statsItem.getName(),
        seq
      }
    ]);

    const promises: Array<Promise<any>> = [];

    statsItem.getValues().forEach((statsValue: StatsValue) => {
      promises.push(statsValueRepository.create(statsItem.getStatsItemID(), statsValue, transaction));
    });

    return Promise.all<any>(promises);
  }

  public async deleteByStatsID(statsID: StatsID, transaction: Transaction): Promise<any> {
    await statsValueRepository.deleteByStatsID(statsID, transaction);

    const query: string = `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

    return transaction.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);
  }
}

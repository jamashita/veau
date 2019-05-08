import { StatsItem } from '../veau-entity/StatsItem';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { StatsID } from '../veau-vo/StatsID';
import { IStatsItemCommand } from './interfaces/IStatsItemCommand';

export class StatsItemMySQLCommand implements IStatsItemCommand {
  private transaction: Transaction;

  public static getInstance(transaction: Transaction): StatsItemMySQLCommand {
    return new StatsItemMySQLCommand(transaction);
  }

  private constructor(transaction: Transaction) {
    this.transaction = transaction;
  }

  public async create(statsID: StatsID, statsItem: StatsItem, seq: number): Promise<any> {
    const query: string = `INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`;

    return this.transaction.query(query, {
        statsItemID: statsItem.getStatsItemID().get().get(),
        statsID: statsID.get().get(),
        name: statsItem.getName(),
        seq
      }
    );
  }

  public async deleteByStatsID(statsID: StatsID): Promise<any> {
    const query: string = `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

    return this.transaction.query(query, {
        statsID: statsID.get().get()
      }
    );
  }
}

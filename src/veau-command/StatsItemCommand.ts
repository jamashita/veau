import { StatsItem } from '../veau-entity/StatsItem';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { IStatsItemCommand } from './interfaces/IStatsItemCommand';
import { StatsValueCommand } from './StatsValueCommand';

export class StatsItemCommand implements IStatsItemCommand {
  private transaction: Transaction;

  public static getInstance(transaction: Transaction): StatsItemCommand {
    return new StatsItemCommand(transaction);
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

    await this.transaction.query(query, [
      {
        statsItemID: statsItem.getStatsItemID().get().get(),
        statsID: statsID.get().get(),
        name: statsItem.getName(),
        seq
      }
    ]);

    const statsValueCommand: StatsValueCommand = StatsValueCommand.getInstance(this.transaction);

    const promises: Array<Promise<any>> = [];

    statsItem.getValues().forEach((statsValue: StatsValue) => {
      promises.push(statsValueCommand.create(statsItem.getStatsItemID(), statsValue));
    });

    return Promise.all<any>(promises);
  }

  public async deleteByStatsID(statsID: StatsID): Promise<any> {
    const statsValueCommand: StatsValueCommand = StatsValueCommand.getInstance(this.transaction);

    await statsValueCommand.deleteByStatsID(statsID);

    const query: string = `DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`;

    return this.transaction.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);
  }
}

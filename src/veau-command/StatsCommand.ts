import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsCommand } from './interfaces/IStatsCommand';
import { StatsItemCommand } from './StatsItemCommand';

export class StatsCommand implements IStatsCommand {
  private transaction: Transaction;

  public static getInstance(transaction: Transaction): StatsCommand {
    return new StatsCommand(transaction);
  }

  private constructor(transaction: Transaction) {
    this.transaction = transaction;
  }

  public async create(stats: Stats, veauAccountID: VeauAccountID): Promise<any> {
    const query: string = `INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      UTC_TIMESTAMP()
      );`;

    await this.transaction.query(query, [
      {
        statsID: stats.getStatsID().get().get(),
        languageID: stats.getLanguage().getLanguageID().get(),
        regionID: stats.getRegion().getRegionID().get(),
        termID: stats.getTerm().get(),
        veauAccountID: veauAccountID.get().get(),
        name: stats.getName(),
        unit: stats.getUnit()
      }
    ]);

    const statsItemCommand: StatsItemCommand = StatsItemCommand.getInstance(this.transaction);

    const promises: Array<Promise<any>> = [];

    stats.getItems().forEach((statsItem: StatsItem, index: number) => {
      promises.push(statsItemCommand.create(stats.getStatsID(), statsItem, index + 1));
    });

    return Promise.all<any>(promises);
  }

  public async deleteByStatsID(statsID: StatsID): Promise<any> {
    const statsItemCommand: StatsItemCommand = StatsItemCommand.getInstance(this.transaction);

    await statsItemCommand.deleteByStatsID(statsID);

    const query: string = `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    return this.transaction.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);
  }
}

import { Stats } from '../veau-entity/Stats';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsCommand } from './interfaces/IStatsCommand';

export class StatsMySQLCommand implements IStatsCommand {
  private transaction: Transaction;

  public static getInstance(transaction: Transaction): StatsMySQLCommand {
    return new StatsMySQLCommand(transaction);
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

    return this.transaction.query(query, {
      statsID: stats.getStatsID().get().get(),
      languageID: stats.getLanguage().getLanguageID().get(),
      regionID: stats.getRegion().getRegionID().get(),
      termID: stats.getTerm().getID(),
      veauAccountID: veauAccountID.get().get(),
      name: stats.getName(),
      unit: stats.getUnit()
    });
  }

  public async deleteByStatsID(statsID: StatsID): Promise<any> {
    const query: string = `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    return this.transaction.query(query, {
      statsID: statsID.get().get()
    });
  }
}

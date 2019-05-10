import { IStatsCommand } from '../veau-command/interfaces/IStatsCommand';
import { IStatsItemCommand } from '../veau-command/interfaces/IStatsItemCommand';
import { IStatsValueCommand } from '../veau-command/interfaces/IStatsValueCommand';
import { StatsItemMySQLCommand } from '../veau-command/StatsItemMySQLCommand';
import { StatsMySQLCommand } from '../veau-command/StatsMySQLCommand';
import { StatsValueMySQLCommand } from '../veau-command/StatsValueMySQLCommand';
import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { IQuery } from '../veau-general/MySQL/IQuery';
import { ITransaction } from '../veau-general/MySQL/ITransaction';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

export class StatsUpdateTransaction implements ITransaction {
  private veauAccountID: VeauAccountID;
  private stats: Stats;

  public static getInstance(veauAccountID: VeauAccountID, stats: Stats): StatsUpdateTransaction {
    return new StatsUpdateTransaction(veauAccountID, stats);
  }

  private constructor(veauAccountID: VeauAccountID, stats: Stats) {
    this.veauAccountID = veauAccountID;
    this.stats = stats;
  }

  public async with(query: IQuery): Promise<any> {
    const statsCommand: IStatsCommand = StatsMySQLCommand.getInstance(query);
    const statsItemCommand: IStatsItemCommand = StatsItemMySQLCommand.getInstance(query);
    const statsValueCommand: IStatsValueCommand = StatsValueMySQLCommand.getInstance(query);

    const {
      veauAccountID,
      stats
    } = this;

    const statsID: StatsID = stats.getStatsID();

    await Promise.all<any>([
      statsValueCommand.deleteByStatsID(statsID),
      statsItemCommand.deleteByStatsID(statsID),
      statsCommand.deleteByStatsID(statsID)
    ]);

    const promises: Array<Promise<any>> = [];

    promises.push(statsCommand.create(stats, veauAccountID));

    this.stats.getItems().forEach((statsItem: StatsItem, index: number) => {
      promises.push(statsItemCommand.create(statsID, statsItem, index + 1));

      statsItem.getValues().forEach((statsValue: StatsValue) => {
        promises.push(statsValueCommand.create(statsItem.getStatsItemID(), statsValue));
      });
    });

    return Promise.all<any>(promises);
  }
}

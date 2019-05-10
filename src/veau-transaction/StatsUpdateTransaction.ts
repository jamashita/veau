import { IStatsCommand } from '../veau-command/interfaces/IStatsCommand';
import { IStatsItemCommand } from '../veau-command/interfaces/IStatsItemCommand';
import { IStatsValueCommand } from '../veau-command/interfaces/IStatsValueCommand';
import { StatsItemMySQLCommand } from '../veau-command/StatsItemMySQLCommand';
import { StatsMySQLCommand } from '../veau-command/StatsMySQLCommand';
import { StatsValueMySQLCommand } from '../veau-command/StatsValueMySQLCommand';
import { Stats } from '../veau-entity/Stats';
import { Transaction } from '../veau-general/MySQL/Deal';
import { Query } from '../veau-general/MySQL/Query';
import { StatsID } from '../veau-vo/StatsID';

export class StatsDeleteDeal implements Transaction {
  private stats: Stats;

  public static getInstance(stats: Stats): StatsDeleteDeal {
    return new StatsDeleteDeal(stats);
  }

  private constructor(stats: Stats) {
    this.stats = stats;
  }

  public with(query: Query): Promise<any> {
    const statsCommand: IStatsCommand = StatsMySQLCommand.getInstance(query);
    const statsItemCommand: IStatsItemCommand = StatsItemMySQLCommand.getInstance(query);
    const statsValueCommand: IStatsValueCommand = StatsValueMySQLCommand.getInstance(query);

    const statsID: StatsID = this.stats.getStatsID();

    return Promise.all<any>([
      statsValueCommand.deleteByStatsID(statsID),
      statsItemCommand.deleteByStatsID(statsID),
      statsCommand.deleteByStatsID(statsID)
    ]);
  }
}

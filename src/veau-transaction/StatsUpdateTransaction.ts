import { StatsCommand } from '../veau-command/StatsCommand';
import { StatsItemCommand } from '../veau-command/StatsItemCommand';
import { StatsValueCommand } from '../veau-command/StatsValueCommand';
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
    const statsCommand: StatsCommand = StatsCommand.getInstance(query);
    const statsItemCommand: StatsItemCommand = StatsItemCommand.getInstance(query);
    const statsValueCommand: StatsValueCommand = StatsValueCommand.getInstance(query);

    const {
      veauAccountID,
      stats
    } = this;

    const statsID: StatsID = stats.getStatsID();

    await statsValueCommand.deleteByStatsID(statsID);
    await statsItemCommand.deleteByStatsID(statsID);
    await statsCommand.deleteByStatsID(statsID);

    const itemPromises: Array<Promise<any>> = [];
    const valuePromises: Array<Promise<any>> = [];

    await statsCommand.create(stats, veauAccountID);

    this.stats.getItems().forEach((statsItem: StatsItem, index: number) => {
      itemPromises.push(statsItemCommand.create(statsID, statsItem, index + 1));

      statsItem.getValues().forEach((statsValue: StatsValue) => {
        valuePromises.push(statsValueCommand.create(statsItem.getStatsItemID(), statsValue));
      });
    });

    await Promise.all<any>(itemPromises);

    return Promise.all<any>(valuePromises);
  }
}

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
  private stats: Stats;
  private veauAccountID: VeauAccountID;

  public constructor(stats: Stats, veauAccountID: VeauAccountID) {
    this.stats = stats;
    this.veauAccountID = veauAccountID;
  }

  public async with(query: IQuery): Promise<unknown> {
    const statsCommand: StatsCommand = new StatsCommand(query);
    const statsItemCommand: StatsItemCommand = new StatsItemCommand(query);
    const statsValueCommand: StatsValueCommand = new StatsValueCommand(query);

    const {
      stats,
      veauAccountID
    } = this;

    const statsID: StatsID = stats.getStatsID();

    await statsValueCommand.deleteByStatsID(statsID);
    await statsItemCommand.deleteByStatsID(statsID);
    await statsCommand.deleteByStatsID(statsID);

    const itemPromises: Array<Promise<unknown>> = [];
    const valuePromises: Array<Promise<unknown>> = [];

    await statsCommand.create(stats, veauAccountID);

    this.stats.getItems().forEach((statsItem: StatsItem, index: number): void => {
      itemPromises.push(statsItemCommand.create(statsID, statsItem, index + 1));

      statsItem.getValues().forEach((statsValue: StatsValue): void => {
        valuePromises.push(statsValueCommand.create(statsItem.getStatsItemID(), statsValue));
      });
    });

    await Promise.all<unknown>(itemPromises);

    return Promise.all<unknown>(valuePromises);
  }
}

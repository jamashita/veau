import { StatsCommand } from '../veau-command/MySQL/StatsCommand';
import { StatsItemCommand } from '../veau-command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../veau-command/MySQL/StatsValueCommand';
import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { IQuery } from '../veau-general/MySQL/IQuery';
import { ITransaction } from '../veau-general/MySQL/ITransaction';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

export class StatsUpdateTransaction implements ITransaction {
  private readonly stats: Stats;
  private readonly veauAccountID: VeauAccountID;

  public static of(stats: Stats, veauAccountID: VeauAccountID): StatsUpdateTransaction {
    return new StatsUpdateTransaction(stats, veauAccountID);
  }

  private constructor(stats: Stats, veauAccountID: VeauAccountID) {
    this.stats = stats;
    this.veauAccountID = veauAccountID;
  }

  public async with(query: IQuery): Promise<unknown> {
    const statsCommand: StatsCommand = StatsCommand.of(query);
    const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
    const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);

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

    this.stats.getItems().forEach((statsItem: StatsItem, index: number) => {
      itemPromises.push(statsItemCommand.create(statsID, statsItem, index + 1));

      statsItem.getValues().forEach((statsValue: StatsValue) => {
        valuePromises.push(statsValueCommand.create(statsValue));
      });
    });

    await Promise.all<unknown>(itemPromises);

    return Promise.all<unknown>(valuePromises);
  }
}

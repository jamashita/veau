import { StatsCommand } from '../veau-command/MySQL/StatsCommand';
import { StatsItemCommand } from '../veau-command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../veau-command/MySQL/StatsValueCommand';
import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { DataSourceError } from '../veau-general/DataSourceError';
import { IQuery } from '../veau-general/MySQL/interfaces/IQuery';
import { ITransaction } from '../veau-general/MySQL/interfaces/ITransaction';
import { Try } from '../veau-general/Try/Try';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

export class StatsUpdateTransaction implements ITransaction {
  public readonly noun: 'StatsUpdateTransaction' = 'StatsUpdateTransaction';
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

    const trial1: Try<void, DataSourceError> = await statsValueCommand.deleteByStatsID(statsID);
    const trial2: Try<void, DataSourceError> = await statsItemCommand.deleteByStatsID(statsID);
    const trial3: Try<void, DataSourceError> = await statsCommand.deleteByStatsID(statsID);

    // TODO when error, terminate and throw error;

    const itemPromises: Array<Promise<unknown>> = [];
    const valuePromises: Array<Promise<unknown>> = [];

    this.stats.getItems().forEach((statsItem: StatsItem, index: number) => {
      itemPromises.push(statsItemCommand.create(statsID, statsItem, index + 1));

      statsItem.getValues().forEach((statsValue: StatsValue) => {
        valuePromises.push(statsValueCommand.create(statsValue));
      });
    });

    const trial4: Try<void, DataSourceError> = await statsCommand.create(stats, veauAccountID);
    const trial5: Array<Try<void, DataSourceError>> = await Promise.all<unknown>(itemPromises);
    const trial5: Array<Try<void, DataSourceError>> = await Promise.all<unknown>(valuePromises);

    // TODO when error, terminate and throw error;
  }
}

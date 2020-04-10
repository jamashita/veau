import { StatsCommand } from '../veau-command/MySQL/StatsCommand';
import { StatsItemCommand } from '../veau-command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../veau-command/MySQL/StatsValueCommand';
import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { DataSourceError } from '../veau-general/DataSourceError';
import { IQuery } from '../veau-general/MySQL/interfaces/IQuery';
import { Failure } from '../veau-general/Try/Failure';
import { manoeuvre } from '../veau-general/Try/Manoeuvre';
import { Try } from '../veau-general/Try/Try';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsUpdateTransaction } from './interfaces/IStatsUpdateTransaction';

export class StatsUpdateTransaction implements IStatsUpdateTransaction {
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

  public async with(query: IQuery): Promise<Try<unknown, DataSourceError>> {
    const statsCommand: StatsCommand = StatsCommand.of(query);
    const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);
    const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);

    const {
      stats,
      veauAccountID
    } = this;

    const statsID: StatsID = stats.getStatsID();

    const tries: Array<Try<void, DataSourceError>> = [
      await statsValueCommand.deleteByStatsID(statsID),
      await statsItemCommand.deleteByStatsID(statsID),
      await statsCommand.deleteByStatsID(statsID)
    ];

    const deleteCompletion: Try<unknown, DataSourceError> = manoeuvre<void, DataSourceError>(tries);

    return deleteCompletion.match<Promise<Try<unknown, DataSourceError>>>(async () => {
      const itemPromises: Array<Promise<Try<void, DataSourceError>>> = [];
      const valuePromises: Array<Promise<Try<void, DataSourceError>>> = [];

      this.stats.getItems().forEach((statsItem: StatsItem, index: number) => {
        itemPromises.push(statsItemCommand.create(statsID, statsItem, index + 1));

        statsItem.getValues().forEach((statsValue: StatsValue) => {
          valuePromises.push(statsValueCommand.create(statsValue));
        });
      });

      const statsInsertTry: Try<void, DataSourceError> = await statsCommand.create(stats, veauAccountID);
      const statsItemInsertTries: Array<Try<void, DataSourceError>> = await Promise.all<Try<void, DataSourceError>>(itemPromises);
      const statsValueInsertTries: Array<Try<void, DataSourceError>> = await Promise.all<Try<void, DataSourceError>>(valuePromises);

      return manoeuvre<unknown, DataSourceError>([
        statsInsertTry,
        ...statsItemInsertTries,
        ...statsValueInsertTries
      ]);
    }, (err: DataSourceError, self: Failure<unknown, DataSourceError>) => {
      return Promise.resolve<Try<unknown, DataSourceError>>(self);
    });
  }
}

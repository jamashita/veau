import { StatsCommand } from '../Command/MySQL/StatsCommand';
import { StatsItemCommand } from '../Command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../Command/MySQL/StatsValueCommand';
import { Stats } from '../Entity/Stats';
import { StatsItem } from '../Entity/StatsItem';
import { DataSourceError } from '../General/DataSourceError';
import { IQuery } from '../General/MySQL/Interface/IQuery';
import { Failure } from '../General/Try/Failure';
import { manoeuvre } from '../General/Try/Manoeuvre';
import { Try } from '../General/Try/Try';
import { StatsID } from '../VO/StatsID';
import { StatsValue } from '../VO/StatsValue';
import { VeauAccountID } from '../VO/VeauAccountID';
import { IStatsUpdateTransaction } from './Interface/IStatsUpdateTransaction';

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

    const statsID: StatsID = this.stats.getStatsID();

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

      const statsInsertTry: Try<void, DataSourceError> = await statsCommand.create(this.stats, this.veauAccountID);
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

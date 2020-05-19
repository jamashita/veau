import { DataSourceError, Dead, ISQL, ITransaction, Schrodinger, Superposition } from 'publikum';

import { IStatsCommand } from '../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../Command/Interface/IStatsValueCommand';
import { Stats } from '../Entity/Stats/Stats';
import { StatsItem } from '../Entity/StatsItem/StatsItem';
import { IStatsUpdateFactory } from '../Factory/Interface/IStatsUpdateFactory';
import { StatsID } from '../VO/StatsOutline/StatsID';
import { StatsValue } from '../VO/StatsValue/StatsValue';
import { VeauAccountID } from '../VO/VeauAccount/VeauAccountID';

export class StatsUpdateTransaction implements ITransaction<Superposition<unknown, DataSourceError>> {
  public readonly noun: 'StatsUpdateTransaction' = 'StatsUpdateTransaction';
  private readonly stats: Stats;
  private readonly veauAccountID: VeauAccountID;
  private readonly statsUpdateFactory: IStatsUpdateFactory;

  public constructor(stats: Stats, veauAccountID: VeauAccountID, statsUpdateFactory: IStatsUpdateFactory) {
    this.stats = stats;
    this.veauAccountID = veauAccountID;
    this.statsUpdateFactory = statsUpdateFactory;
  }

  public async with(sql: ISQL): Promise<Superposition<unknown, DataSourceError>> {
    const statsCommand: IStatsCommand = this.statsUpdateFactory.forgeStatsCommand(sql);
    const statsItemCommand: IStatsItemCommand = this.statsUpdateFactory.forgeStatsItemCommand(sql);
    const statsValueCommand: IStatsValueCommand = this.statsUpdateFactory.forgeStatsValueCommand(sql);

    const statsID: StatsID = this.stats.getStatsID();

    const superpositions: Array<Superposition<void, DataSourceError>> = [
      await statsValueCommand.deleteByStatsID(statsID),
      await statsItemCommand.deleteByStatsID(statsID),
      await statsCommand.deleteByStatsID(statsID)
    ];

    const deleteCompletion: Superposition<unknown, DataSourceError> = manoeuvre<void, DataSourceError>(superpositions);

    return deleteCompletion.match<unknown, DataSourceError>(
      async () => {
        const itemPromises: Array<Promise<Superposition<void, DataSourceError>>> = [];
        const valuePromises: Array<Promise<Superposition<void, DataSourceError>>> = [];

        this.stats.getItems().forEach((statsItem: StatsItem, index: number) => {
          itemPromises.push(statsItemCommand.create(statsID, statsItem, index + 1));

          statsItem.getValues().forEach((statsValue: StatsValue) => {
            valuePromises.push(statsValueCommand.create(statsItem.getStatsItemID(), statsValue));
          });
        });

        const statsInsertSuperposition: Superposition<void, DataSourceError> = await statsCommand.create(
          this.stats,
          this.veauAccountID
        );
        const statsItemInsertTries: Array<Superposition<void, DataSourceError>> = await Promise.all<
          Superposition<void, DataSourceError>
        >(itemPromises);
        const statsValueInsertTries: Array<Superposition<void, DataSourceError>> = await Promise.all<
          Superposition<void, DataSourceError>
        >(valuePromises);

        return Schrodinger.all<unknown, DataSourceError>([
          statsInsertSuperposition,
          ...statsItemInsertTries,
          ...statsValueInsertTries
        ]);
      },
      (err: DataSourceError, self: Dead<unknown, DataSourceError>) => {
        return Promise.resolve<Superposition<unknown, DataSourceError>>(self);
      }
    );
  }
}

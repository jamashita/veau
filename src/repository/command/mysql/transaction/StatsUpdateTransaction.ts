import { ISQL, ITransaction, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { Superposition } from '@jamashita/genitore-superposition';
import { Stats } from '../../../../domain/entity/Stats/Stats.js';
import { StatsItem } from '../../../../domain/entity/StatsItem/StatsItem.js';
import { StatsID } from '../../../../domain/vo/StatsOutline/StatsID.js';
import { StatsValue } from '../../../../domain/vo/StatsValue/StatsValue.js';
import { VeauAccountID } from '../../../../domain/vo/VeauAccount/VeauAccountID.js';
import { IStatsUpdateFactory } from '../../../../factory/IStatsUpdateFactory.js';
import { IStatsCommand } from '../../IStatsCommand.js';
import { IStatsItemCommand } from '../../IStatsItemCommand.js';
import { IStatsValueCommand } from '../../IStatsValueCommand.js';

export class StatsUpdateTransaction implements ITransaction<Schrodinger<unknown, MySQLError>, 'StatsUpdateTransaction'> {
  public readonly noun: 'StatsUpdateTransaction' = 'StatsUpdateTransaction';
  private readonly stats: Stats;
  private readonly veauAccountID: VeauAccountID;
  private readonly statsUpdateFactory: IStatsUpdateFactory;

  public constructor(stats: Stats, veauAccountID: VeauAccountID, statsUpdateFactory: IStatsUpdateFactory) {
    this.stats = stats;
    this.veauAccountID = veauAccountID;
    this.statsUpdateFactory = statsUpdateFactory;
  }

  public with(sql: ISQL): Promise<Schrodinger<unknown, MySQLError>> {
    const statsCommand: IStatsCommand<MySQLError> = this.statsUpdateFactory.forgeStatsCommand(sql);
    const statsItemCommand: IStatsItemCommand<MySQLError> = this.statsUpdateFactory.forgeStatsItemCommand(sql);
    const statsValueCommand: IStatsValueCommand<MySQLError> = this.statsUpdateFactory.forgeStatsValueCommand(sql);

    const statsID: StatsID = this.stats.getStatsID();

    const superpositions: Array<Superposition<unknown, MySQLError>> = [
      statsValueCommand.deleteByStatsID(statsID),
      statsItemCommand.deleteByStatsID(statsID),
      statsCommand.deleteByStatsID(statsID)
    ];

    return Superposition.all<unknown, MySQLError>(superpositions).map<unknown, MySQLError>(() => {
      const items: Array<Superposition<unknown, MySQLError>> = [];
      const values: Array<Superposition<unknown, MySQLError>> = [];

      this.stats.getItems().forEach((statsItem: StatsItem, index: number) => {
        items.push(statsItemCommand.create(statsID, statsItem, index + 1));

        statsItem.getValues().forEach((statsValue: StatsValue) => {
          values.push(statsValueCommand.create(statsItem.getStatsItemID(), statsValue));
        });
      });

      return statsCommand.create(this.stats, this.veauAccountID).map<unknown, MySQLError>(() => {
        return Superposition.all<unknown, MySQLError>(items).map(() => {
          return Superposition.all<unknown, MySQLError>(values);
        });
      });
    }).terminate();
  }
}

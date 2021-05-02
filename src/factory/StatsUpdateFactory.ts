import { ISQL } from '@jamashita/catacombe-mysql';
import { StatsCommand } from '../repository/command/mysql/StatsCommand';
import { StatsItemCommand } from '../repository/command/mysql/StatsItemCommand';
import { StatsValueCommand } from '../repository/command/mysql/StatsValueCommand';
import { IStatsUpdateFactory } from './interface/IStatsUpdateFactory';

export class StatsUpdateFactory implements IStatsUpdateFactory {
  public readonly noun: 'StatsUpdateFactory' = 'StatsUpdateFactory';

  public forgeStatsCommand(sql: ISQL): StatsCommand {
    return new StatsCommand(sql);
  }

  public forgeStatsItemCommand(sql: ISQL): StatsItemCommand {
    return new StatsItemCommand(sql);
  }

  public forgeStatsValueCommand(sql: ISQL): StatsValueCommand {
    return new StatsValueCommand(sql);
  }
}

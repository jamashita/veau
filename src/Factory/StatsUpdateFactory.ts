import { ISQL } from 'publikum';
import { StatsCommand } from '../Command/MySQL/StatsCommand';
import { StatsItemCommand } from '../Command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../Command/MySQL/StatsValueCommand';
import { IStatsUpdateFactory } from './Interface/IStatsUpdateFactory';

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

import { ISQL } from '@jamashita/catacombe-mysql';

import { StatsCommand } from '../repository/command/MySQL/StatsCommand';
import { StatsItemCommand } from '../repository/command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../repository/command/MySQL/StatsValueCommand';
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

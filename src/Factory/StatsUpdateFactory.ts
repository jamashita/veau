import { StatsCommand } from '../Command/MySQL/StatsCommand';
import { StatsItemCommand } from '../Command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../Command/MySQL/StatsValueCommand';
import { IQuery } from '../General/MySQL/Interface/IQuery';
import { IStatsUpdateFactory } from './Interface/IStatsUpdateFactory';

export class StatsUpdateFactory implements IStatsUpdateFactory {
  public readonly noun: 'StatsUpdateFactory' = 'StatsUpdateFactory';

  public forgeStatsCommand(query: IQuery): StatsCommand {
    return new StatsCommand(query);
  }

  public forgeStatsItemCommand(query: IQuery): StatsItemCommand {
    return new StatsItemCommand(query);
  }

  public forgeStatsValueCommand(query: IQuery): StatsValueCommand {
    return new StatsValueCommand(query);
  }
}

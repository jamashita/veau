import { StatsCommand } from '../Command/MySQL/StatsCommand';
import { StatsItemCommand } from '../Command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../Command/MySQL/StatsValueCommand';
import { IQuery } from '../General/MySQL/Interface/IQuery';
import { IStatsUpdateFactory } from './Interface/IStatsUpdateFactory';

export class StatsUpdateFactory implements IStatsUpdateFactory {
  public readonly noun: 'StatsUpdateFactory' = 'StatsUpdateFactory';
  private readonly query: IQuery

  public constructor(query: IQuery) {
    this.query = query;
  }

  public forgeStatsCommand(): StatsCommand {
    return new StatsCommand(this.query);
  }

  public forgeStatsItemCommand(): StatsItemCommand {
    return new StatsItemCommand(this.query);
  }

  public forgeStatsValueCommand(): StatsValueCommand {
    return new StatsValueCommand(this.query);
  }
}

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';
import { IQuery } from '../../General/MySQL/Interface/IQuery';
import { IStatsUpdateFactory } from '../Interface/IStatsUpdateFactory';

export class MockStatsUpdateFactory implements IStatsUpdateFactory {
  public readonly noun: 'StatsUpdateFactory' = 'StatsUpdateFactory';
  private readonly statsCommand: IStatsCommand;
  private readonly statsItemCommand:  IStatsItemCommand;
  private readonly statsValueCommand:  IStatsValueCommand;

  public constructor(
    statsCommand: IStatsCommand,
    statsItemCommand:  IStatsItemCommand,
    statsValueCommand:  IStatsValueCommand
  ) {
    this.statsCommand = statsCommand;
    this.statsItemCommand = statsItemCommand;
    this.statsValueCommand = statsValueCommand;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public forgeStatsCommand(query: IQuery): IStatsCommand {
    return this.statsCommand;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public forgeStatsItemCommand(query: IQuery): IStatsItemCommand {
    return this.statsItemCommand;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public forgeStatsValueCommand(query: IQuery): IStatsValueCommand {
    return this.statsValueCommand;
  }
}

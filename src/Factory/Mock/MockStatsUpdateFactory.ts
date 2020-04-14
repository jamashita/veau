import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';
import { IStatsUpdateFactory } from '../Interface/IStatsUpdateFactory';

export class MockStatsUpdateFactory implements IStatsUpdateFactory {
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

  public forgeStatsCommand(): IStatsCommand {
    return this.statsCommand;
  }

  public forgeStatsItemCommand(): IStatsItemCommand {
    return this.statsItemCommand;
  }

  public forgeStatsValueCommand(): IStatsValueCommand {
    return this.statsValueCommand;
  }
}

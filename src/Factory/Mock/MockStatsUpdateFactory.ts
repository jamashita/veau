import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';
import { ISQL } from '../../General/MySQL/Interface/ISQL';
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
  public forgeStatsCommand(sql: ISQL): IStatsCommand {
    return this.statsCommand;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public forgeStatsItemCommand(sql: ISQL): IStatsItemCommand {
    return this.statsItemCommand;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public forgeStatsValueCommand(sql: ISQL): IStatsValueCommand {
    return this.statsValueCommand;
  }
}

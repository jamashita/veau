import { MySQLError } from '@jamashita/catacombe-mysql';

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';
import { IStatsUpdateFactory } from '../Interface/IStatsUpdateFactory';

export class MockStatsUpdateFactory implements IStatsUpdateFactory {
  public readonly noun: 'StatsUpdateFactory' = 'StatsUpdateFactory';
  private readonly statsCommand: IStatsCommand<MySQLError>;
  private readonly statsItemCommand: IStatsItemCommand<MySQLError>;
  private readonly statsValueCommand: IStatsValueCommand<MySQLError>;

  public constructor(
    statsCommand: IStatsCommand<MySQLError>,
    statsItemCommand: IStatsItemCommand<MySQLError>,
    statsValueCommand: IStatsValueCommand<MySQLError>
  ) {
    this.statsCommand = statsCommand;
    this.statsItemCommand = statsItemCommand;
    this.statsValueCommand = statsValueCommand;
  }

  public forgeStatsCommand(): IStatsCommand<MySQLError> {
    return this.statsCommand;
  }

  public forgeStatsItemCommand(): IStatsItemCommand<MySQLError> {
    return this.statsItemCommand;
  }

  public forgeStatsValueCommand(): IStatsValueCommand<MySQLError> {
    return this.statsValueCommand;
  }
}

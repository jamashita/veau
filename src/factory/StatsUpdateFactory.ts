import { ISQL } from '@jamashita/catacombe-mysql';
import { StatsItemMySQLCommand } from '../repository/command/mysql/StatsItemMySQLCommand.js';
import { StatsMySQLCommand } from '../repository/command/mysql/StatsMySQLCommand.js';
import { StatsValueMySQLCommand } from '../repository/command/mysql/StatsValueMySQLCommand.js';
import { IStatsUpdateFactory } from './IStatsUpdateFactory.js';

export class StatsUpdateFactory implements IStatsUpdateFactory {
  public readonly noun: 'StatsUpdateFactory' = 'StatsUpdateFactory';

  public forgeStatsCommand(sql: ISQL): StatsMySQLCommand {
    return new StatsMySQLCommand(sql);
  }

  public forgeStatsItemCommand(sql: ISQL): StatsItemMySQLCommand {
    return new StatsItemMySQLCommand(sql);
  }

  public forgeStatsValueCommand(sql: ISQL): StatsValueMySQLCommand {
    return new StatsValueMySQLCommand(sql);
  }
}

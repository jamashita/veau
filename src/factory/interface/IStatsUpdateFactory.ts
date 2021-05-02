import { Noun } from '@jamashita/anden-type';
import { ISQL, MySQLError } from '@jamashita/catacombe-mysql';

import { IStatsCommand } from '../../repository/command/interface/IStatsCommand';
import { IStatsItemCommand } from '../../repository/command/interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../repository/command/interface/IStatsValueCommand';

export interface IStatsUpdateFactory extends Noun<'StatsUpdateFactory'> {
  readonly noun: 'StatsUpdateFactory';

  forgeStatsCommand(sql: ISQL): IStatsCommand<MySQLError>;

  forgeStatsItemCommand(sql: ISQL): IStatsItemCommand<MySQLError>;

  forgeStatsValueCommand(sql: ISQL): IStatsValueCommand<MySQLError>;
}

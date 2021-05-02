import { Noun } from '@jamashita/anden-type';
import { ISQL, MySQLError } from '@jamashita/catacombe-mysql';

import { IStatsCommand } from '../../repository/command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../repository/command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../repository/command/Interface/IStatsValueCommand';

export interface IStatsUpdateFactory extends Noun<'StatsUpdateFactory'> {
  readonly noun: 'StatsUpdateFactory';

  forgeStatsCommand(sql: ISQL): IStatsCommand<MySQLError>;

  forgeStatsItemCommand(sql: ISQL): IStatsItemCommand<MySQLError>;

  forgeStatsValueCommand(sql: ISQL): IStatsValueCommand<MySQLError>;
}

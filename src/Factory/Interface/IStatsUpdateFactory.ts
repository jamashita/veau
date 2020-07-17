import { Noun } from '@jamashita/publikum-interface';
import { ISQL, MySQLError } from '@jamashita/publikum-mysql';

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';

export interface IStatsUpdateFactory extends Noun<'StatsUpdateFactory'> {
  readonly noun: 'StatsUpdateFactory';

  forgeStatsCommand(sql: ISQL): IStatsCommand<MySQLError>;

  forgeStatsItemCommand(sql: ISQL): IStatsItemCommand<MySQLError>;

  forgeStatsValueCommand(sql: ISQL): IStatsValueCommand<MySQLError>;
}

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';
import { Noun } from '../../General/Interface/Noun';
import { ISQL } from '../../General/MySQL/Interface/ISQL';

export interface IStatsUpdateFactory extends Noun {
  readonly noun: 'StatsUpdateFactory';

  forgeStatsCommand(sql: ISQL): IStatsCommand;

  forgeStatsItemCommand(sql: ISQL): IStatsItemCommand;

  forgeStatsValueCommand(sql: ISQL): IStatsValueCommand;
}

import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';
import { Noun } from '../../General/Interface/Noun';

export interface IStatsUpdateFactory extends Noun {
  readonly noun: 'StatsUpdateFactory';

  forgeStatsCommand(): IStatsCommand;

  forgeStatsItemCommand(): IStatsItemCommand;

  forgeStatsValueCommand(): IStatsValueCommand;
}

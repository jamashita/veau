import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';

export interface IStatsUpdateFactory {

  forgeStatsCommand(): IStatsCommand;

  forgeStatsItemCommand(): IStatsItemCommand;

  forgeStatsValueCommand(): IStatsValueCommand;
}

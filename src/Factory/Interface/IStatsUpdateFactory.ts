import { IStatsCommand } from '../../Command/Interface/IStatsCommand';
import { IStatsItemCommand } from '../../Command/Interface/IStatsItemCommand';
import { IStatsValueCommand } from '../../Command/Interface/IStatsValueCommand';
import { Noun } from '../../General/Interface/Noun';
import { IQuery } from '../../General/MySQL/Interface/IQuery';

export interface IStatsUpdateFactory extends Noun {
  readonly noun: 'StatsUpdateFactory';

  forgeStatsCommand(query: IQuery): IStatsCommand;

  forgeStatsItemCommand(query: IQuery): IStatsItemCommand;

  forgeStatsValueCommand(query: IQuery): IStatsValueCommand;
}

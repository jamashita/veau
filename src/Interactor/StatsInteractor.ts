import { Noun } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { IStatsCommand } from '../Command/Interface/IStatsCommand';
import { Type } from '../Container/Types';
import { Stats } from '../domain/entity/Stats/Stats';
import { NoSuchElementError } from '../Query/Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Query/Interface/IStatsOutlineQuery';
import { IStatsQuery } from '../Query/Interface/IStatsQuery';
import { Page } from '../domain/vo/Page/Page';
import { StatsError } from '../domain/vo/StatsOutline/Error/StatsError';
import { StatsOutlineError } from '../domain/vo/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../domain/vo/StatsOutline/StatsID';
import { StatsOutlines } from '../domain/vo/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../domain/vo/VeauAccount/VeauAccountID';

@injectable()
export class StatsInteractor implements Noun<'StatsInteractor'> {
  public readonly noun: 'StatsInteractor' = 'StatsInteractor';
  private readonly statsQuery: IStatsQuery;
  private readonly outlineQuery: IStatsOutlineQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @inject(Type.StatsKernelQuery) statsQuery: IStatsQuery,
    @inject(Type.StatsOutlineMySQLQuery) outlineQuery: IStatsOutlineQuery,
    @inject(Type.StatsKernelCommand) statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.outlineQuery = outlineQuery;
    this.statsCommand = statsCommand;
  }

  public findByStatsID(statsID: StatsID): Superposition<Stats, DataSourceError | NoSuchElementError | StatsError> {
    return this.statsQuery.findByStatsID(statsID);
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, DataSourceError | StatsOutlineError> {
    return this.outlineQuery.findByVeauAccountID(veauAccountID, page);
  }

  public save(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, DataSourceError> {
    return this.statsCommand.create(stats, veauAccountID);
  }
}

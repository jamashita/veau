import { DataSourceError } from '@jamashita/anden-error';
import { Noun } from '@jamashita/anden-type';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { IStatsCommand } from '../Command/Interface/IStatsCommand';
import { Type } from '../Container/Types';
import { Stats } from '../Entity/Stats/Stats';
import { NoSuchElementError } from '../Query/Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Query/Interface/IStatsOutlineQuery';
import { IStatsQuery } from '../Query/Interface/IStatsQuery';
import { Page } from '../VO/Page/Page';
import { StatsError } from '../VO/StatsOutline/Error/StatsError';
import { StatsOutlineError } from '../VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../VO/StatsOutline/StatsID';
import { StatsOutlines } from '../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../VO/VeauAccount/VeauAccountID';

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

  public findByStatsID(statsID: StatsID): Superposition<Stats, NoSuchElementError | StatsError | DataSourceError> {
    return this.statsQuery.findByStatsID(statsID);
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, StatsOutlineError | DataSourceError> {
    return this.outlineQuery.findByVeauAccountID(veauAccountID, page);
  }

  public save(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, DataSourceError> {
    return this.statsCommand.create(stats, veauAccountID);
  }
}

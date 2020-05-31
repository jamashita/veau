import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';

import { IStatsCommand } from '../Command/Interface/IStatsCommand';
import { Type } from '../Container/Types';
import { StatsError } from '../Entity/Stats/Error/StatsError';
import { Stats } from '../Entity/Stats/Stats';
import { NoSuchElementError } from '../Query/Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Query/Interface/IStatsOutlineQuery';
import { IStatsQuery } from '../Query/Interface/IStatsQuery';
import { Page } from '../VO/Page/Page';
import { StatsOutlinesError } from '../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsID } from '../VO/StatsOutline/StatsID';
import { StatsOutlines } from '../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../VO/VeauAccount/VeauAccountID';

@injectable()
export class StatsInteractor implements Noun {
  public readonly noun: 'StatsInteractor' = 'StatsInteractor';
  private readonly statsQuery: IStatsQuery;
  private readonly statsOutlineQuery: IStatsOutlineQuery;
  private readonly statsCommand: IStatsCommand;

  public constructor(
    @inject(Type.StatsKernelQuery) statsQuery: IStatsQuery,
    @inject(Type.StatsOutlineMySQLQuery) statsOutlineQuery: IStatsOutlineQuery,
    @inject(Type.StatsKernelCommand) statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.statsOutlineQuery = statsOutlineQuery;
    this.statsCommand = statsCommand;
  }

  public findByStatsID(
    statsID: StatsID
  ): Promise<Superposition<Stats, NoSuchElementError | StatsError | DataSourceError>> {
    return this.statsQuery.findByStatsID(statsID);
  }

  public findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    return this.statsOutlineQuery.findByVeauAccountID(veauAccountID, page);
  }

  public save(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<unknown, DataSourceError>> {
    return this.statsCommand.create(stats, veauAccountID);
  }
}

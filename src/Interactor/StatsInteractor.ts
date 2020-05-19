import { inject, injectable } from 'inversify';
import { DataSourceError, Noun, Superposition } from 'publikum';
import { IStatsCommand } from '../Command/Interface/IStatsCommand';
import { TYPE } from '../Container/Types';
import { Stats } from '../Entity/Stats';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { StatsError } from '../Error/StatsError';
import { StatsOutlinesError } from '../VO/StatsOutline/Error/StatsOutlinesError';
import { IStatsOutlineQuery } from '../Query/Interface/IStatsOutlineQuery';
import { IStatsQuery } from '../Query/Interface/IStatsQuery';
import { Page } from '../VO/Page/Page';
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
    @inject(TYPE.StatsKernelQuery) statsQuery: IStatsQuery,
    @inject(TYPE.StatsOutlineMySQLQuery) statsOutlineQuery: IStatsOutlineQuery,
    @inject(TYPE.StatsKernelCommand) statsCommand: IStatsCommand
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

  public save(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<void, DataSourceError>> {
    return this.statsCommand.create(stats, veauAccountID);
  }
}

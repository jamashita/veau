import { inject, injectable } from 'inversify';
import { DataSourceError, IMySQL, Noun, Superposition } from 'publikum';
import { IStatsCommand } from '../Command/Interface/IStatsCommand';
import { TYPE } from '../Container/Types';
import { Stats } from '../Entity/Stats';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { StatsError } from '../Error/StatsError';
import { StatsOutlinesError } from '../Error/StatsOutlinesError';
import { IStatsOutlineQuery } from '../Query/Interface/IStatsOutlineQuery';
import { IStatsQuery } from '../Query/Interface/IStatsQuery';
import { Page } from '../VO/Page';
import { StatsID } from '../VO/StatsID';
import { StatsOutlines } from '../VO/StatsOutlines';
import { VeauAccountID } from '../VO/VeauAccountID';

@injectable()
export class StatsInteractor implements Noun {
  public readonly noun: 'StatsInteractor' = 'StatsInteractor';
  private readonly statsQuery: IStatsQuery;
  private readonly statsCommand: IStatsCommand;
  private readonly statsOutlineQuery: IStatsOutlineQuery;

  public constructor(
    @inject(TYPE.MySQL) mysql: IMySQL,
    @inject(TYPE.StatsMySQLQuery) statsQuery: IStatsQuery,
    @inject(TYPE.StatsOutlineMySQLQuery) statsOutlineQuery: IStatsOutlineQuery,
    @inject(TYPE.StatsKernelCommand) statsCommand: IStatsCommand
  ) {
    this.statsQuery = statsQuery;
    this.statsCommand = statsCommand;
    this.statsOutlineQuery = statsOutlineQuery;
  }

  public findByStatsID(statsID: StatsID): Promise<Superposition<Stats, NoSuchElementError | StatsError | DataSourceError>> {
    return this.statsQuery.findByStatsID(statsID);
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    return this.statsOutlineQuery.findByVeauAccountID(veauAccountID, page);
  }

  public save(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<unknown, DataSourceError>> {
    return this.statsCommand.create(stats, veauAccountID);
  }
}

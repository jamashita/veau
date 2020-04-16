import { inject, injectable } from 'inversify';
import { TYPE } from '../Container/Types';
import { Stats } from '../Entity/Stats';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { StatsError } from '../Error/StatsError';
import { StatsOutlinesError } from '../Error/StatsOutlinesError';
import { StatsUpdateFactory } from '../Factory/StatsUpdateFactory';
import { DataSourceError } from '../General/DataSourceError';
import { Noun } from '../General/Interface/Noun';
import { IMySQL } from '../General/MySQL/Interface/IMySQL';
import { Try } from '../General/Superposition/Try';
import { IStatsOutlineQuery } from '../Query/Interface/IStatsOutlineQuery';
import { IStatsQuery } from '../Query/Interface/IStatsQuery';
import { StatsUpdateTransaction } from '../Transaction/StatsUpdateTransaction';
import { Page } from '../VO/Page';
import { StatsID } from '../VO/StatsID';
import { StatsOutlines } from '../VO/StatsOutlines';
import { VeauAccountID } from '../VO/VeauAccountID';

@injectable()
export class StatsInteractor implements Noun {
  public readonly noun: 'StatsInteractor' = 'StatsInteractor';
  private readonly mysql: IMySQL;
  private readonly statsQuery: IStatsQuery;
  private readonly statsOutlineQuery: IStatsOutlineQuery;

  public constructor(
  @inject(TYPE.MySQL) mysql: IMySQL,
    @inject(TYPE.StatsMySQLQuery) statsQuery: IStatsQuery,
    @inject(TYPE.StatsOutlineMySQLQuery) statsOutlineQuery: IStatsOutlineQuery
  ) {
    this.mysql = mysql;
    this.statsQuery = statsQuery;
    this.statsOutlineQuery = statsOutlineQuery;
  }

  public findByStatsID(statsID: StatsID): Promise<Try<Stats, NoSuchElementError | StatsError | DataSourceError>> {
    return this.statsQuery.findByStatsID(statsID);
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Try<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    return this.statsOutlineQuery.findByVeauAccountID(veauAccountID, page);
  }

  public save(stats: Stats, veauAccountID: VeauAccountID): Promise<Try<unknown, DataSourceError>> {
    const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
      stats,
      veauAccountID,
      new StatsUpdateFactory()
    );

    return this.mysql.transact<Try<unknown, DataSourceError>>(statsUpdateTransaction);
  }
}

import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { TYPE } from '../veau-container/Types';
import { Stats } from '../veau-entity/Stats';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { StatsError } from '../veau-error/StatsError';
import { StatsOutlinesError } from '../veau-error/StatsOutlinesError';
import { DataSourceError } from '../veau-general/DataSourceError';
import { IMySQL } from '../veau-general/MySQL/Interface/IMySQL';
import { Try } from '../veau-general/Try/Try';
import { IStatsOutlineQuery } from '../veau-query/Interface/IStatsOutlineQuery';
import { IStatsQuery } from '../veau-query/Interface/IStatsQuery';
import { StatsUpdateTransaction } from '../veau-transaction/StatsUpdateTransaction';
import { Page } from '../veau-vo/Page';
import { StatsID } from '../veau-vo/StatsID';
import { StatsOutlines } from '../veau-vo/StatsOutlines';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IInteractor } from './IInteractor';

const logger: log4js.Logger = log4js.getLogger();

@injectable()
export class StatsInteractor implements IInteractor {
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
    const statsUpdateTransaction: StatsUpdateTransaction = StatsUpdateTransaction.of(stats, veauAccountID);

    return this.mysql.transact<Try<unknown, DataSourceError>>(statsUpdateTransaction);
  }
}

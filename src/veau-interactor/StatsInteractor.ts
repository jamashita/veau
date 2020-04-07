import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { TYPE } from '../veau-container/Types';
import { Stats } from '../veau-entity/Stats';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { NotFoundError } from '../veau-error/NotFoundError';
import { StatsError } from '../veau-error/StatsError';
import { StatsOutlinesError } from '../veau-error/StatsOutlinesError';
import { DataSourceError } from '../veau-general/DataSourceError';
import { IMySQL } from '../veau-general/MySQL/interfaces/IMySQL';
import { ITransaction } from '../veau-general/MySQL/interfaces/ITransaction';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { IStatsOutlineQuery } from '../veau-query/interfaces/IStatsOutlineQuery';
import { IStatsQuery } from '../veau-query/interfaces/IStatsQuery';
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

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL,
    @inject(TYPE.StatsQuery) statsQuery: IStatsQuery,
    @inject(TYPE.StatsOutlineQuery) statsOutlineQuery: IStatsOutlineQuery
  ) {
    this.mysql = mysql;
    this.statsQuery = statsQuery;
    this.statsOutlineQuery = statsOutlineQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<Try<Stats, NotFoundError | StatsError>> {
    const trial: Try<Stats, NoSuchElementError | StatsError | DataSourceError> = await this.statsQuery.findByStatsID(statsID);

    return trial.match<Try<Stats, NotFoundError | StatsError>>((stats: Stats) => {
      return Success.of<Stats, NotFoundError>(stats);
    }, (err: NoSuchElementError | StatsError | DataSourceError) => {
      logger.error(err.message);

      // TODO handling DataSourceError
      if (err instanceof StatsError) {
        return Failure.of<Stats, StatsError>(err);
      }

      return Failure.of<Stats, NotFoundError>(new NotFoundError(err.message));
    });
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Try<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    return this.statsOutlineQuery.findByVeauAccountID(veauAccountID, page.getLimit(), page.getOffset());
  }

  // FIXME manage to do it (returns to Try)
  public save(stats: Stats, veauAccountID: VeauAccountID): Promise<unknown> {
    const statsUpdateTransaction: ITransaction = StatsUpdateTransaction.of(stats, veauAccountID);

    return this.mysql.transact(statsUpdateTransaction);
  }
}

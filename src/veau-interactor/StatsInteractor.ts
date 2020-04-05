import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { TYPE } from '../veau-container/Types';
import { Stats } from '../veau-entity/Stats';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { NotFoundError } from '../veau-error/NotFoundError';
import { StatsError } from '../veau-error/StatsError';
import { StatsOutlinesError } from '../veau-error/StatsOutlinesError';
import { ITransaction } from '../veau-general/MySQL/ITransaction';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { IStatsOutlineQuery } from '../veau-query/interfaces/IStatsOutlineQuery';
import { StatsQuery } from '../veau-query/StatsQuery';
import { StatsUpdateTransaction } from '../veau-transaction/StatsUpdateTransaction';
import { Page } from '../veau-vo/Page';
import { StatsID } from '../veau-vo/StatsID';
import { StatsOutlines } from '../veau-vo/StatsOutlines';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

const logger: log4js.Logger = log4js.getLogger();

@injectable()
export class StatsInteractor {
  private mysql: MySQL;
  private statsQuery: StatsQuery;
  private statsOutlineQuery: IStatsOutlineQuery;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL,
    @inject(TYPE.StatsQuery) statsQuery: StatsQuery,
    @inject(TYPE.StatsOutlineQuery) statsOutlineQuery: IStatsOutlineQuery
  ) {
    this.mysql = mysql;
    this.statsQuery = statsQuery;
    this.statsOutlineQuery = statsOutlineQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<Try<Stats, NotFoundError | StatsError>> {
    const trial: Try<Stats, NoSuchElementError | StatsError> = await this.statsQuery.findByStatsID(statsID);

    return trial.match<Try<Stats, NotFoundError>>((stats: Stats) => {
      return Success.of<Stats, NotFoundError>(stats);
    }, (err: NoSuchElementError | StatsError) => {
      logger.error(err.message);

      if (err instanceof StatsError) {
        return Failure.of<Stats, StatsError>(err);
      }

      return Failure.of<Stats, NotFoundError>(new NotFoundError(err.message));
    });
  }

  public findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Try<StatsOutlines, StatsOutlinesError>> {
    return this.statsOutlineQuery.findByVeauAccountID(veauAccountID, page.getLimit(), page.getOffset());
  }

  // FIXME manage to do it (returns to Try)
  public save(stats: Stats, veauAccountID: VeauAccountID): Promise<unknown> {
    const statsUpdateTransaction: ITransaction = StatsUpdateTransaction.of(stats, veauAccountID);

    return this.mysql.transact(statsUpdateTransaction);
  }
}

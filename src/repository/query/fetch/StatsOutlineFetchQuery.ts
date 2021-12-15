import { UnimplementedError } from '@jamashita/anden-error';
import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { Page } from '../../../domain/vo/Page/Page.js';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline.js';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines.js';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IStatsOutlineQuery } from '../IStatsOutlineQuery.js';
import { IFetchQuery } from './IFetchQuery.js';

@injectable()
export class StatsOutlineFetchQuery implements IStatsOutlineQuery<FetchError>, IFetchQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly fetch: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) fetch: IFetch<'json'>) {
    this.fetch = fetch;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_statsID: StatsID): Superposition<StatsOutline, FetchError | NoSuchElementError | StatsOutlineError> {
    throw new UnimplementedError();
  }

  public findByVeauAccountID(_veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, FetchError | StatsOutlineError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.fetch.get(`/api/stats/page/${page.get()}`);
    }, FetchError).map<StatsOutlines, FetchError | StatsOutlineError>(({
      status,
      body
    }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (StatsOutlines.validate(body)) {
            return StatsOutlines.ofJSON(body);
          }

          throw new StatsOutlineError('StatsOutlineFetchQuery.findByVeauAccountID()');
        }
        default: {
          throw new FetchError('UNKNOWN ERROR');
        }
      }
    }, StatsOutlineError);
  }
}

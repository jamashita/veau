import { UnimplementedError } from '@jamashita/anden-error';
import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { Page } from '../../../domain/vo/Page/Page';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IStatsOutlineQuery } from '../interface/IStatsOutlineQuery';
import { IFetchQuery } from './IFetchQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery<FetchError>, IFetchQuery {
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
    }, FetchError).map<StatsOutlines, FetchError | StatsOutlineError>(({ status, body }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (StatsOutlines.validate(body)) {
            return StatsOutlines.ofJSON(body);
          }

          throw new StatsOutlineError('StatsOutlineQuery.findByVeauAccountID()');
        }
        default: {
          throw new FetchError('UNKNOWN ERROR');
        }
      }
    }, StatsOutlineError);
  }
}

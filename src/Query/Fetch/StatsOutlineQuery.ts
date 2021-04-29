import { UnimplementedError } from '@jamashita/anden-error';
import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { Page } from '../../VO/Page/Page';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IFetchQuery } from './Interface/IFetchQuery';

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

import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
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
  private readonly ajax: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) ajax: IFetch<'json'>) {
    this.ajax = ajax;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_statsID: StatsID): Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | FetchError> {
    throw new UnimplementedError();
  }

  public findByVeauAccountID(_veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, StatsOutlineError | FetchError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.ajax.get(`/api/stats/page/${page.get()}`);
    }, FetchError).map<StatsOutlines, StatsOutlineError | FetchError>(({ status, body }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (StatsOutlines.validate(body)) {
            return StatsOutlines.ofJSON(body);
          }

          throw new StatsOutlineError('StatsOutlineQuery.findByVeauAccountID()');
        }
        default: {
          throw new FetchError('UNKNOWN ERROR', status);
        }
      }
    }, StatsOutlineError);
  }
}

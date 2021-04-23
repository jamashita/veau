import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsError } from '../../VO/StatsOutline/Error/StatsError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsQuery } from '../Interface/IStatsQuery';
import { IFetchQuery } from './Interface/IFetchQuery';

@injectable()
export class StatsQuery implements IStatsQuery<FetchError>, IFetchQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly ajax: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) ajax: IFetch<'json'>) {
    this.ajax = ajax;
  }

  public findByStatsID(statsID: StatsID): Superposition<Stats, StatsError | NoSuchElementError | FetchError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.ajax.get(`/api/stats/${statsID.get().get()}`);
    }, FetchError).map<Stats, StatsError | NoSuchElementError | FetchError>(({ status, body }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (Stats.validate(body)) {
            return Stats.ofJSON(body);
          }

          throw new StatsError('StatsQuery.findByStatsID()');
        }
        case StatusCodes.NO_CONTENT: {
          throw new NoSuchElementError('NOT FOUND');
        }
        default: {
          throw new FetchError('UNKNOWN ERROR', status);
        }
      }
    }, StatsError, NoSuchElementError);
  }
}

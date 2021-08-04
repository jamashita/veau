import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { Stats } from '../../../domain/entity/Stats/Stats.js';
import { StatsError } from '../../../domain/vo/StatsOutline/error/StatsError.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IStatsQuery } from '../IStatsQuery.js';
import { IFetchQuery } from './IFetchQuery.js';

@injectable()
export class StatsFetchQuery implements IStatsQuery<FetchError>, IFetchQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly ajax: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) ajax: IFetch<'json'>) {
    this.ajax = ajax;
  }

  public findByStatsID(statsID: StatsID): Superposition<Stats, FetchError | NoSuchElementError | StatsError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.ajax.get(`/api/stats/${statsID.get().get()}`);
    }, FetchError).map<Stats, FetchError | NoSuchElementError | StatsError>(({
      status,
      body
    }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (Stats.validate(body)) {
            return Stats.ofJSON(body);
          }

          throw new StatsError('StatsCaskQuery.findByStatsID()');
        }
        case StatusCodes.NO_CONTENT: {
          throw new NoSuchElementError('NOT FOUND');
        }
        default: {
          throw new FetchError('UNKNOWN ERROR');
        }
      }
    }, StatsError, NoSuchElementError);
  }
}

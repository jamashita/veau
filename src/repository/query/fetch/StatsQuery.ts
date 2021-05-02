import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { Stats } from '../../../domain/entity/Stats/Stats';
import { StatsError } from '../../../domain/vo/StatsOutline/error/StatsError';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IStatsQuery } from '../interface/IStatsQuery';
import { IFetchQuery } from './IFetchQuery';

@injectable()
export class StatsQuery implements IStatsQuery<FetchError>, IFetchQuery {
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

          throw new StatsError('StatsQuery.findByStatsID()');
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

import { UnimplementedError } from '@jamashita/anden-error';
import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { Stats } from '../../../domain/entity/Stats/Stats.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { IStatsCommand } from '../IStatsCommand.js';
import { IFetchCommand } from './IFetchCommand.js';

@injectable()
export class StatsFetchCommand implements IStatsCommand<FetchError>, IFetchCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly fetch: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) fetch: IFetch<'json'>) {
    this.fetch = fetch;
  }

  public create(stats: Stats): Superposition<unknown, FetchError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.fetch.post('/api/stats', stats.toJSON());
    }, FetchError).map<unknown, FetchError>((response: FetchResponse<'json'>) => {
      switch (response.status) {
        case StatusCodes.CREATED: {
          return null;
        }
        default: {
          throw new FetchError('UNKNOWN ERROR');
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteByStatsID(_statsID: StatsID): Superposition<unknown, FetchError> {
    throw new UnimplementedError();
  }
}

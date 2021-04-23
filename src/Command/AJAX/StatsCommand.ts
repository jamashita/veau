import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { IStatsCommand } from '../Interface/IStatsCommand';
import { IFetchCommand } from './Interface/IFetchCommand';

@injectable()
export class StatsCommand implements IStatsCommand<FetchError>, IFetchCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly ajax: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) ajax: IFetch<'json'>) {
    this.ajax = ajax;
  }

  public create(stats: Stats): Superposition<unknown, FetchError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.ajax.post('/api/stats', stats.toJSON());
    }, FetchError).map<unknown, FetchError>((response: FetchResponse<'json'>) => {
      switch (response.status) {
        case StatusCodes.CREATED: {
          return null;
        }
        default: {
          throw new FetchError('UNKNOWN ERROR', response.status);
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteByStatsID(_statsID: StatsID): Superposition<unknown, FetchError> {
    throw new UnimplementedError();
  }
}

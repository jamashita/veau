import { FetchError, FetchResponse, IFetch } from '@jamashita/catacombe-fetch';
import { Superposition } from '@jamashita/genitore-superposition';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';
import { IFetchQuery } from './Interface/IFetchQuery';

@injectable()
export class VeauAccountQuery implements IVeauAccountQuery<FetchError>, IFetchQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'Fetch' = 'Fetch';
  private readonly ajax: IFetch<'json'>;

  public constructor(@inject(Type.Fetch) ajax: IFetch<'json'>) {
    this.ajax = ajax;
  }

  public find(): Superposition<VeauAccount, FetchError | VeauAccountError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.ajax.get('/api/accounts');
    }, FetchError).map<VeauAccount, FetchError | VeauAccountError>(({ status, body }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (VeauAccount.validate(body)) {
            return VeauAccount.ofJSON(body);
          }

          throw new VeauAccountError('VeauAccountQuery.find()');
        }
        default: {
          throw new FetchError('IDENTITY DID NOT RETURN StatusCodes.OK', status);
        }
      }
    }, VeauAccountError);
  }

  public findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<VeauAccount, FetchError | VeauAccountError> {
    return Superposition.playground<FetchResponse<'json'>, FetchError>(() => {
      return this.ajax.post('/api/auth', entranceInformation.toJSON());
    }, FetchError).map<VeauAccount, FetchError | VeauAccountError>(({ status, body }: FetchResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (VeauAccount.validate(body)) {
            return VeauAccount.ofJSON(body);
          }

          throw new VeauAccountError('VeauAccountQuery.findByEntranceInfo()');
        }
        case StatusCodes.UNAUTHORIZED: {
          throw new FetchError('StatusCodes.UNAUTHORIZED', StatusCodes.UNAUTHORIZED);
        }
        default: {
          throw new FetchError('UNKNOWN ERROR', status);
        }
      }
    }, VeauAccountError);
  }
}

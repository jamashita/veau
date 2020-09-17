import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { Superposition } from '@jamashita/publikum-monad';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class VeauAccountQuery implements IVeauAccountQuery<AJAXError>, IAJAXQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX<'json'>;

  public constructor(@inject(Type.AJAX) ajax: IAJAX<'json'>) {
    this.ajax = ajax;
  }

  public find(): Superposition<VeauAccount, VeauAccountError | AJAXError> {
    return Superposition.playground<AJAXResponse<'json'>, AJAXError>(() => {
      return this.ajax.get('/api/accounts');
    }, AJAXError).map<VeauAccount, VeauAccountError | AJAXError>(({ status, body }: AJAXResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (VeauAccount.validate(body)) {
            return VeauAccount.ofJSON(body);
          }

          throw new VeauAccountError('VeauAccountQuery.find()');
        }
        default: {
          throw new AJAXError('IDENTITY DID NOT RETURN StatusCodes.OK', status);
        }
      }
    }, VeauAccountError);
  }

  public findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<VeauAccount, VeauAccountError | AJAXError> {
    return Superposition.playground<AJAXResponse<'json'>, AJAXError>(() => {
      return this.ajax.post('/api/auth', entranceInformation.toJSON());
    }, AJAXError).map<VeauAccount, VeauAccountError | AJAXError>(({ status, body }: AJAXResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (VeauAccount.validate(body)) {
            return VeauAccount.ofJSON(body);
          }

          throw new VeauAccountError('VeauAccountQuery.findByEntranceInfo()');
        }
        case StatusCodes.UNAUTHORIZED: {
          throw new AJAXError('StatusCodes.UNAUTHORIZED', StatusCodes.UNAUTHORIZED);
        }
        default: {
          throw new AJAXError('UNKNOWN ERROR', status);
        }
      }
    }, VeauAccountError);
  }
}

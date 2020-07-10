import { OK, UNAUTHORIZED } from 'http-status';
import { inject, injectable } from 'inversify';

import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount, VeauAccountJSON } from '../../VO/VeauAccount/VeauAccount';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class VeauAccountQuery implements IVeauAccountQuery<AJAXError>, IAJAXQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public find(): Superposition<VeauAccount, VeauAccountError | AJAXError> {
    return Superposition.playground<AJAXResponse<VeauAccountJSON>, AJAXError>(() => {
      return this.ajax.get<VeauAccountJSON>('/api/accounts');
    }, AJAXError).map<VeauAccount, VeauAccountError | AJAXError>(({ status, body }: AJAXResponse<VeauAccountJSON>) => {
      switch (status) {
        case OK: {
          return VeauAccount.ofJSON(body);
        }
        default: {
          throw new AJAXError('IDENTITY DID NOT RETURN OK', status);
        }
      }
    }, AJAXError);
  }

  public findByEntranceInfo(
    entranceInformation: EntranceInformation
  ): Superposition<VeauAccount, VeauAccountError | AJAXError> {
    return Superposition.playground<AJAXResponse<VeauAccountJSON>, AJAXError>(() => {
      return this.ajax.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());
    }, AJAXError).map<VeauAccount, VeauAccountError | AJAXError>(({ status, body }: AJAXResponse<VeauAccountJSON>) => {
      switch (status) {
        case OK: {
          return VeauAccount.ofJSON(body);
        }
        case UNAUTHORIZED: {
          throw new AJAXError('UNAUTHORIZED', UNAUTHORIZED);
        }
        default: {
          throw new AJAXError('UNKNOWN ERROR', status);
        }
      }
    }, AJAXError);
  }
}

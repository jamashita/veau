import { OK, UNAUTHORIZED } from 'http-status';
import { inject, injectable } from 'inversify';

import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount, VeauAccountJSON } from '../../VO/VeauAccount/VeauAccount';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class VeauAccountQuery implements IVeauAccountQuery, IAJAXQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.get<VeauAccountJSON>('/api/accounts');
    // prettier-ignore
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<VeauAccount, VeauAccountError | DataSourceError>(
          (veauAccount: VeauAccount) => {
            return Alive.of<VeauAccount, DataSourceError>(veauAccount);
          },
          (err: VeauAccountError, self: Dead<VeauAccount, VeauAccountError>) => {
            return self;
          }
        );
      }
      default: {
        return Dead.of<VeauAccount, AJAXError>(new AJAXError('IDENTITY DID NOT RETURN OK', status));
      }
    }
  }

  public async findByEntranceInfo(
    entranceInformation: EntranceInformation
  ): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.post<VeauAccountJSON>(
      '/api/auth',
      entranceInformation.toJSON()
    );
    // prettier-ignore
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<VeauAccount, VeauAccountError | DataSourceError>(
          (veauAccount: VeauAccount) => {
            return Alive.of<VeauAccount, DataSourceError>(veauAccount);
          },
          (err: VeauAccountError, self: Dead<VeauAccount, VeauAccountError>) => {
            return self;
          }
        );
      }
      case UNAUTHORIZED: {
        return Dead.of<VeauAccount, AJAXError>(new AJAXError('UNAUTHORIZED', UNAUTHORIZED));
      }
      default: {
        return Dead.of<VeauAccount, AJAXError>(new AJAXError('UNKNOWN ERROR', status));
      }
    }
  }
}

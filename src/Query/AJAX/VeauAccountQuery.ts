import { OK, UNAUTHORIZED } from 'http-status';
import { inject, injectable } from 'inversify';
import { AJAXError, AJAXResponse, Alive, DataSourceError, Dead, IAJAX, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount, VeauAccountJSON } from '../../VO/VeauAccount';
import { IAJAXQuery } from '../Interface/IAJAXQuery';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';

@injectable()
export class VeauAccountQuery implements IVeauAccountQuery, IAJAXQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.get<VeauAccountJSON>('/api/identity');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<VeauAccount, VeauAccountError | DataSourceError>((veauAccount: VeauAccount) => {
          return Alive.of<VeauAccount, DataSourceError>(veauAccount);
        }, (err: VeauAccountError, self: Dead<VeauAccount, VeauAccountError>) => {
          return self;
        });
      }
      default: {
        return Dead.of<VeauAccount, AJAXError>(new AJAXError('IDENTITY DID NOT RETURN OK', status));
      }
    }
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<VeauAccount, VeauAccountError | DataSourceError>((veauAccount: VeauAccount) => {
          return Alive.of<VeauAccount, DataSourceError>(veauAccount);
        }, (err: VeauAccountError, self: Dead<VeauAccount, VeauAccountError>) => {
          return self;
        });
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

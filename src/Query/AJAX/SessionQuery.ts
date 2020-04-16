import { OK, UNAUTHORIZED } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { AJAXError } from '../../General/AJAX/AJAXError';
import { AJAXResponse } from '../../General/AJAX/AJAXResponse';
import { IAJAX } from '../../General/AJAX/Interface/IAJAX';
import { DataSourceError } from '../../General/DataSourceError';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Try } from '../../General/Superposition/Try';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount, VeauAccountJSON } from '../../VO/VeauAccount';
import { IAJAXQuery } from '../Interface/IAJAXQuery';
import { ISessionQuery } from '../Interface/ISessionQuery';

@injectable()
export class SessionQuery implements ISessionQuery, IAJAXQuery {
  public readonly noun: 'SessionQuery' = 'SessionQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async find(): Promise<Try<VeauAccount, VeauAccountError | DataSourceError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.get<VeauAccountJSON>('/api/identity');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<VeauAccount, VeauAccountError | DataSourceError>((veauAccount: VeauAccount) => {
          return Success.of<VeauAccount, DataSourceError>(veauAccount);
        }, (err: VeauAccountError, self: Failure<VeauAccount, VeauAccountError>) => {
          return self;
        });
      }
      default: {
        return Failure.of<VeauAccount, AJAXError>(new AJAXError('IDENTITY DID NOT RETURN OK', status));
      }
    }
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Try<VeauAccount, VeauAccountError | DataSourceError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<VeauAccount, VeauAccountError | DataSourceError>((veauAccount: VeauAccount) => {
          return Success.of<VeauAccount, DataSourceError>(veauAccount);
        }, (err: VeauAccountError, self: Failure<VeauAccount, VeauAccountError>) => {
          return self;
        });
      }
      case UNAUTHORIZED: {
        return Failure.of<VeauAccount, AJAXError>(new AJAXError('UNAUTHORIZED', UNAUTHORIZED));
      }
      default: {
        return Failure.of<VeauAccount, AJAXError>(new AJAXError('UNKNOWN ERROR', status));
      }
    }
  }
}

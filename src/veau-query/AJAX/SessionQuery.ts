import { OK, UNAUTHORIZED } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { AuthenticationFailureError } from '../../veau-error/AuthenticationFailureError';
import { UnauthorizedError } from '../../veau-error/UnauthorizedError';
import { VeauAccountError } from '../../veau-error/VeauAccountError';
import { AJAXError } from '../../veau-general/AJAX/AJAXError';
import { AJAXResponse } from '../../veau-general/AJAX/AJAXResponse';
import { IAJAX } from '../../veau-general/AJAX/interfaces/IAJAX';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { VeauAccount, VeauAccountJSON } from '../../veau-vo/VeauAccount';
import { IAJAXQuery } from '../interfaces/IAJAXQuery';
import { ISessionQuery } from '../interfaces/ISessionQuery';

@injectable()
export class SessionQuery implements ISessionQuery, IAJAXQuery {
  public readonly noun: 'SessionQuery' = 'SessionQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async find(): Promise<Try<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.get<VeauAccountJSON>('/api/identity');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<Try<VeauAccount, VeauAccountError | DataSourceError>>((veauAccount: VeauAccount) => {
          return Success.of<VeauAccount, DataSourceError>(veauAccount);
        }, (err: VeauAccountError) => {
          return Failure.of<VeauAccount, VeauAccountError>(err);
        });
      }
      default: {
        return Failure.of<VeauAccount, UnauthorizedError>(new UnauthorizedError());
      }
    }
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<Try<VeauAccount, VeauAccountError | DataSourceError>>((veauAccount: VeauAccount) => {
          return Success.of<VeauAccount, DataSourceError>(veauAccount);
        }, (err: VeauAccountError) => {
          return Failure.of<VeauAccount, VeauAccountError>(err);
        });
      }
      case UNAUTHORIZED: {
        return Failure.of<VeauAccount, AuthenticationFailureError>(new AuthenticationFailureError());
      }
      default: {
        return Failure.of<VeauAccount, AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }
}

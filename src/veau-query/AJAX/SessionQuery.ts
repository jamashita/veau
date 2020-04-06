import { OK, UNAUTHORIZED } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { AJAXError } from '../../veau-error/AJAXError';
import { AuthenticationFailureError } from '../../veau-error/AuthenticationFailureError';
import { UnauthorizedError } from '../../veau-error/UnauthorizedError';
import { VeauAccountError } from '../../veau-error/VeauAccountError';
import { AJAXRequestable } from '../../veau-general/AJAX/AJAXRequestable';
import { AJAXResponse } from '../../veau-general/AJAX/AJAXResponse';
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
  private ajax: AJAXRequestable;

  public constructor(@inject(TYPE.AJAX) ajax: AJAXRequestable) {
    this.ajax = ajax;
  }

  public async find(): Promise<Try<VeauAccount, VeauAccountError | UnauthorizedError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.get<VeauAccountJSON>('/api/identity');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<Try<VeauAccount, VeauAccountError>>((veauAccount: VeauAccount) => {
          return Success.of<VeauAccount, VeauAccountError>(veauAccount);
        }, (err: VeauAccountError) => {
          return Failure.of<VeauAccount, VeauAccountError>(new VeauAccountError(err.message));
        });
      }
      default: {
        return Failure.of<VeauAccount, UnauthorizedError>(new UnauthorizedError());
      }
    }
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Try<VeauAccount, VeauAccountError | AuthenticationFailureError | AJAXError>> {
    const response: AJAXResponse<VeauAccountJSON> = await this.ajax.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body).match<Try<VeauAccount, VeauAccountError>>((veauAccount: VeauAccount) => {
          return Success.of<VeauAccount, VeauAccountError>(veauAccount);
        }, (err: VeauAccountError) => {
          return Failure.of<VeauAccount, VeauAccountError>(new VeauAccountError(err.message));
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
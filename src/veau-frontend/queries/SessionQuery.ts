import { OK, UNAUTHORIZED } from 'http-status';
import { AJAXError } from '../../veau-error/AJAXError';
import { AuthenticationFailureError } from '../../veau-error/AuthenticationFailureError';
import { UnauthorizedError } from '../../veau-error/UnauthorizedError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { VeauAccount, VeauAccountJSON } from '../../veau-vo/VeauAccount';

export class SessionQuery {

  public async find(): Promise<Try<VeauAccount, UnauthorizedError>> {
    const response: AJAXResponse<VeauAccountJSON> = await AJAX.get<VeauAccountJSON>('/api/identity');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Success.of<VeauAccount, UnauthorizedError>(VeauAccount.ofJSON(body));
      }
      default: {
        return Failure.of<VeauAccount, UnauthorizedError>(new UnauthorizedError());
      }
    }
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Try<VeauAccount, AuthenticationFailureError | AJAXError>> {
    const response: AJAXResponse<VeauAccountJSON> = await AJAX.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Success.of<VeauAccount, AuthenticationFailureError>(VeauAccount.ofJSON(body));
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

import { OK, UNAUTHORIZED } from 'http-status';
import { VeauAccount, VeauAccountJSON } from '../../veau-vo/VeauAccount';
import { AJAXError } from '../../veau-error/AJAXError';
import { AuthenticationFailureError } from '../../veau-error/AuthenticationFailureError';
import { UnauthorizedError } from '../../veau-error/UnauthorizedError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';

export class SessionQuery {
  private static instance: SessionQuery = new SessionQuery();

  public static getInstance(): SessionQuery {
    return SessionQuery.instance;
  }

  private constructor() {
  }

  public async find(): Promise<VeauAccount> {
    const response: AJAXResponse<VeauAccountJSON> = await AJAX.get<VeauAccountJSON>('/api/identity');
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body);
      }
      default: {
        throw new UnauthorizedError();
      }
    }
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<VeauAccount> {
    const response: AJAXResponse<VeauAccountJSON> = await AJAX.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return VeauAccount.ofJSON(body);
      }
      case UNAUTHORIZED: {
        throw new AuthenticationFailureError();
      }
      default: {
        throw new AJAXError('UNKNOWN ERROR');
      }
    }
  }
}

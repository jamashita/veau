import { UNAUTHORIZED } from 'http-status';
import { VeauAccount, VeauAccountJSON } from '../../veau-entity/VeauAccount';
import { AuthenticationFailureError } from '../../veau-error/AuthenticationFailureError';
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

    return VeauAccount.fromJSON(response.body);
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<VeauAccount> {
    try {
      const response: AJAXResponse<VeauAccountJSON> = await AJAX.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());

      return VeauAccount.fromJSON(response.body);
    }
    catch (err) {
      if (err.status === UNAUTHORIZED) {
        throw new AuthenticationFailureError();
      }

      throw err;
    }
  }
}

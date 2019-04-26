import { VeauAccount, VeauAccountJSON } from '../../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../../veau-factory/VeauAccountFactory';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { ISessionQuery } from './interfaces/ISessionQuery';

export class SessionAJAXQuery implements ISessionQuery {
  private static instance: SessionAJAXQuery = new SessionAJAXQuery();
  private static veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

  public static getInstance(): SessionAJAXQuery {
    return SessionAJAXQuery.instance;
  }

  private constructor() {
  }

  public async find(): Promise<VeauAccount> {
    const response: AJAXResponse<VeauAccountJSON> = await AJAX.get<VeauAccountJSON>('/api/identity');

    return SessionAJAXQuery.veauAccountFactory.fromJSON(response.body);
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<VeauAccount> {
    const response: AJAXResponse<VeauAccountJSON> = await AJAX.post<VeauAccountJSON>('/api/auth', entranceInformation.toJSON());

    return SessionAJAXQuery.veauAccountFactory.fromJSON(response.body);
  }
}

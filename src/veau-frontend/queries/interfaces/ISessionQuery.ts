import { VeauAccount } from '../../../veau-entity/VeauAccount';
import { EntranceInformation } from '../../../veau-vo/EntranceInformation';

export interface ISessionQuery {

  find(): Promise<VeauAccount>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<VeauAccount>;
}

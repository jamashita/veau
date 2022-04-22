import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { EntranceInformation } from '../EntranceInformation/EntranceInformation';
import { VeauAccount } from './VeauAccount';
import { VeauAccountError } from './VeauAccountError';

export interface VeauAccountRepository<E extends DataSourceError = DataSourceError> {
  find(): Promise<Schrodinger<VeauAccount, E | VeauAccountError>>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Schrodinger<VeauAccount, E | VeauAccountError>>;
}

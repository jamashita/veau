import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { EntranceInformation } from '../EntranceInformation/EntranceInformation';
import { Identity } from './Identity';
import { IdentityError } from './IdentityError';

export interface IdentityRepository<E extends DataSourceError = DataSourceError> {
  find(): Promise<Schrodinger<Identity, E | IdentityError>>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Schrodinger<Identity, E | IdentityError>>;
}

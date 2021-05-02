import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { EntranceInformation } from '../../domain/VO/EntranceInformation/EntranceInformation';
import { IdentityError } from '../../domain/VO/Identity/Error/IdentityError';
import { Identity } from '../../domain/VO/Identity/Identity';
import { IQuery } from './IQuery';

export interface IIdentityQuery<E extends DataSourceError = DataSourceError> extends IQuery<'IdentityQuery'> {
  readonly noun: 'IdentityQuery';

  find(): Superposition<Identity, E | IdentityError>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<Identity, E | IdentityError>;
}

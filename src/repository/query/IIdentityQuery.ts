import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { EntranceInformation } from '../../domain/vo/EntranceInformation/EntranceInformation.js';
import { IdentityError } from '../../domain/vo/Identity/error/IdentityError.js';
import { Identity } from '../../domain/vo/Identity/Identity.js';
import { IQuery } from './IQuery.js';

export interface IIdentityQuery<E extends DataSourceError = DataSourceError> extends IQuery<'IdentityQuery'> {
  readonly noun: 'IdentityQuery';

  find(): Superposition<Identity, E | IdentityError>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<Identity, E | IdentityError>;
}

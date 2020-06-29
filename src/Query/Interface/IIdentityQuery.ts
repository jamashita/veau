import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { IdentityError } from '../../VO/Identity/Error/IdentityError';
import { Identity } from '../../VO/Identity/Identity';
import { IQuery } from './IQuery';

export interface IIdentityQuery<E extends DataSourceError = DataSourceError> extends IQuery<'IdentityQuery'> {
  readonly noun: 'IdentityQuery';

  find(): Superposition<Identity, IdentityError | E>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<Identity, IdentityError | E>;
}

import { DataSourceError, Superposition } from 'publikum';

import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { IdentityError } from '../../VO/Identity/Error/IdentityError';
import { Identity } from '../../VO/Identity/Identity';
import { IQuery } from './IQuery';

export interface IIdentityQuery extends IQuery {
  readonly noun: 'IdentityQuery';

  find(): Promise<Superposition<Identity, IdentityError | DataSourceError>>;

  findByEntranceInfo(
    entranceInformation: EntranceInformation
  ): Promise<Superposition<Identity, IdentityError | DataSourceError>>;
}

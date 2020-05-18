import { Superposition, DataSourceError } from 'publikum';
import { EntranceInformation } from 'src/VO/EntranceInformation';
import { IQuery } from './IQuery';
import { Identity } from '../../VO/Identity';
import { IdentityError } from '../../Error/IdentityError';
export interface IIdentityQuery extends IQuery {
  readonly noun: 'IdentityQuery';

  find(): Promise<Superposition<Identity, IdentityError | DataSourceError>>;

  findByEntranceInfo(
    entranceInformation: EntranceInformation
  ): Promise<Superposition<Identity, IdentityError | DataSourceError>>;
}

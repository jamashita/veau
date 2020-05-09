import { Superposition, DataSourceError, Noun } from 'publikum';
import { VeauAccount } from 'src/VO/VeauAccount';
import { VeauAccountError } from 'src/Error/VeauAccountError';
import { EntranceInformation } from 'src/VO/EntranceInformation';
import { IQuery } from './IQuery';
export interface IIdentityQuery extends IQuery {
  readonly noun: 'IdentityQuery';

  find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;
}

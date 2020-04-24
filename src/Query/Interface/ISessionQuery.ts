import { DataSourceError, Superposition } from 'publikum';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount } from '../../VO/VeauAccount';
import { IQuery } from './IQuery';

export interface ISessionQuery extends IQuery {
  readonly noun: 'SessionQuery';

  find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;
}

import { VeauAccountError } from '../../Error/VeauAccountError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount } from '../../VO/VeauAccount';
import { IQuery } from './IQuery';

export interface ISessionQuery extends IQuery {
  readonly noun: 'SessionQuery';

  find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;
}

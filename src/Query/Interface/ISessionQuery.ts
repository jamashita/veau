import { VeauAccountError } from '../../Error/VeauAccountError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount } from '../../VO/VeauAccount';
import { IQuery } from './IQuery';

export interface ISessionQuery extends IQuery {
  readonly noun: 'SessionQuery';

  find(): Promise<Try<VeauAccount, VeauAccountError | DataSourceError>>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Try<VeauAccount, VeauAccountError | DataSourceError>>;
}

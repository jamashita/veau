import { AuthenticationFailureError } from '../../Error/AuthenticationFailureError';
import { UnauthorizedError } from '../../Error/UnauthorizedError';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount } from '../../VO/VeauAccount';
import { IQuery } from './IQuery';

export interface ISessionQuery extends IQuery {
  readonly noun: 'SessionQuery';

  find(): Promise<Try<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError>>;
}

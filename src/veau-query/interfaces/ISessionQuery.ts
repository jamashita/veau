import { AuthenticationFailureError } from '../../veau-error/AuthenticationFailureError';
import { UnauthorizedError } from '../../veau-error/UnauthorizedError';
import { VeauAccountError } from '../../veau-error/VeauAccountError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { VeauAccount } from '../../veau-vo/VeauAccount';
import { IQuery } from './IQuery';

export interface ISessionQuery extends IQuery {
  readonly noun: 'SessionQuery';

  find(): Promise<Try<VeauAccount, VeauAccountError | UnauthorizedError>>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError>>;
}

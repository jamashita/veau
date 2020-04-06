import { AccountError } from '../../veau-error/AccountError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { SourceError } from '../../veau-general/SourceError';
import { Try } from '../../veau-general/Try/Try';
import { Account } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';
import { IQuery } from './IQuery';

export interface IAccountQuery<E extends SourceError> extends IQuery {
  readonly noun: 'AccountQuery';

  findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError | E>>;
}

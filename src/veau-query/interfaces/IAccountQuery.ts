import { AccountError } from '../../veau-error/AccountError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Try } from '../../veau-general/Try/Try';
import { Account } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';
import { IQuery } from './IQuery';

export interface IAccountQuery extends IQuery {
  readonly noun: 'AccountQuery';

  findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError>>;
}

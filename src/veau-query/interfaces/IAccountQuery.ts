import { AccountError } from '../../veau-error/AccountError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Try } from '../../veau-general/Try/Try';
import { Account } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';

export interface IAccountQuery {

  findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError>>;
}

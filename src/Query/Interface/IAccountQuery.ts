import { AccountError } from '../../Error/AccountError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { Account } from '../../VO/Account';
import { AccountName } from '../../VO/AccountName';
import { IQuery } from './IQuery';

export interface IAccountQuery extends IQuery {
  readonly noun: 'AccountQuery';

  findByAccount(account: AccountName): Promise<Try<Account, AccountError | NoSuchElementError | DataSourceError>>;
}

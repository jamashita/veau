import { AccountError } from '../../Error/AccountError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { Account } from '../../VO/Account';
import { AccountName } from '../../VO/AccountName';
import { IQuery } from './IQuery';

export interface IAccountQuery extends IQuery {
  readonly noun: 'AccountQuery';

  findByAccount(account: AccountName): Promise<Superposition<Account, AccountError | NoSuchElementError | DataSourceError>>;
}

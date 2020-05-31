import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Account } from '../../VO/Account/Account';
import { AccountName } from '../../VO/Account/AccountName';
import { AccountError } from '../../VO/Account/Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IAccountQuery extends IQuery {
  readonly noun: 'AccountQuery';

  findByAccount(
    account: AccountName
  ): Promise<Superposition<Account, AccountError | NoSuchElementError | DataSourceError>>;
}

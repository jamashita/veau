import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Account } from '../../../domain/vo/Account/Account.js';
import { AccountName } from '../../../domain/vo/Account/AccountName.js';
import { AccountError } from '../../../domain/vo/Account/error/AccountError.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IQuery } from './IQuery.js';

export interface IAccountQuery<E extends DataSourceError = DataSourceError> extends IQuery<'AccountQuery'> {
  readonly noun: 'AccountQuery';

  findByAccount(account: AccountName): Superposition<Account, AccountError | E | NoSuchElementError>;
}

import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Account } from '../../../domain/vo/Account/Account';
import { AccountName } from '../../../domain/vo/Account/AccountName';
import { AccountError } from '../../../domain/vo/Account/error/AccountError';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IAccountQuery<E extends DataSourceError = DataSourceError> extends IQuery<'AccountQuery'> {
  readonly noun: 'AccountQuery';

  findByAccount(account: AccountName): Superposition<Account, AccountError | E | NoSuchElementError>;
}

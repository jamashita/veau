import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { Account } from '../../domain/VO/Account/Account';
import { AccountName } from '../../domain/VO/Account/AccountName';
import { AccountError } from '../../domain/VO/Account/Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IAccountQuery<E extends DataSourceError = DataSourceError> extends IQuery<'AccountQuery'> {
  readonly noun: 'AccountQuery';

  findByAccount(account: AccountName): Superposition<Account, AccountError | E | NoSuchElementError>;
}

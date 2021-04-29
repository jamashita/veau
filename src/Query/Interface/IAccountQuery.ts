import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { Account } from '../../VO/Account/Account';
import { AccountName } from '../../VO/Account/AccountName';
import { AccountError } from '../../VO/Account/Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IAccountQuery<E extends DataSourceError = DataSourceError> extends IQuery<'AccountQuery'> {
  readonly noun: 'AccountQuery';

  findByAccount(account: AccountName): Superposition<Account, AccountError | E | NoSuchElementError>;
}

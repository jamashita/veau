import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Account } from '../../../domain/vo/Account/Account.js';
import { AccountError } from '../../../domain/vo/Account/error/AccountError.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IAccountQuery } from '../IAccountQuery.js';
import { IMockQuery } from './IMockQuery.js';

export class MockAccountQuery implements IAccountQuery, IMockQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByAccount(): Superposition<Account, AccountError | DataSourceError | NoSuchElementError> {
    throw new UnimplementedError();
  }
}

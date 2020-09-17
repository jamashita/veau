import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { Account } from '../../VO/Account/Account';
import { AccountError } from '../../VO/Account/Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IAccountQuery } from '../Interface/IAccountQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockAccountQuery implements IAccountQuery, IMockQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByAccount(): Superposition<Account, AccountError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }
}

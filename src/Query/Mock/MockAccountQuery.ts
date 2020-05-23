import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

import { Account } from '../../VO/Account/Account';
import { AccountError } from '../../VO/Account/Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IAccountQuery } from '../Interface/IAccountQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockAccountQuery implements IAccountQuery, IMockQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByAccount(): Promise<Superposition<Account, AccountError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Account, AccountError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }
}

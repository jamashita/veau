import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Account } from '../../domain/VO/Account/Account';
import { AccountError } from '../../domain/VO/Account/Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IAccountQuery } from '../Interface/IAccountQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockAccountQuery implements IAccountQuery, IMockQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByAccount(): Superposition<Account, AccountError | DataSourceError | NoSuchElementError> {
    throw new UnimplementedError();
  }
}

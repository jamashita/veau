import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Account } from '../../../domain/vo/Account/Account';
import { AccountError } from '../../../domain/vo/Account/error/AccountError';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IAccountQuery } from '../interface/IAccountQuery';
import { IMockQuery } from './interface/IMockQuery';

export class MockAccountQuery implements IAccountQuery, IMockQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByAccount(): Superposition<Account, AccountError | DataSourceError | NoSuchElementError> {
    throw new UnimplementedError();
  }
}

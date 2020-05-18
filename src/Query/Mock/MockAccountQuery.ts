import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { AccountError } from '../../Error/AccountError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { Account } from '../../VO/Account';
import { AccountName } from '../../VO/AccountName';
import { IAccountQuery } from '../Interface/IAccountQuery';
import { IMockQuery } from '../Interface/IMockQuery';

export class MockAccountQuery implements IAccountQuery, IMockQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public findByAccount(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    account: AccountName
  ): Promise<Superposition<Account, AccountError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Account, AccountError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }
}

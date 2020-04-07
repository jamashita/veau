import { AccountError } from '../../veau-error/AccountError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { Account } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';
import { IAccountQuery } from '../interfaces/IAccountQuery';
import { IMockQuery } from '../interfaces/IMockQuery';

export class MockAccountQuery implements IAccountQuery, IMockQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'Mock' = 'Mock';


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError | DataSourceError>> {
    return Promise.reject<Try<Account, NoSuchElementError | AccountError | DataSourceError>>(new UnimplementedError());
  }
}
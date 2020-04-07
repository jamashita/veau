import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { AccountError } from '../veau-error/AccountError';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { DataSourceError } from '../veau-general/DataSourceError';
import { Try } from '../veau-general/Try/Try';
import { Account } from '../veau-vo/Account';
import { AccountName } from '../veau-vo/AccountName';
import { IAccountQuery } from './interfaces/IAccountQuery';

@injectable()
export class AccountQuery implements IAccountQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'Complex' = 'Complex';
  private readonly accountQuery: IAccountQuery;

  public constructor(@inject(TYPE.AccountMySQLQuery) accountQuery: IAccountQuery) {
    this.accountQuery = accountQuery;
  }

  public findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError | DataSourceError>> {
    return this.accountQuery.findByAccount(account);
  }
}

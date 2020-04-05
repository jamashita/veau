import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { AccountError } from '../veau-error/AccountError';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Try } from '../veau-general/Try/Try';
import { Account } from '../veau-vo/Account';
import { AccountName } from '../veau-vo/AccountName';
import { IAccountQuery } from './interfaces/IAccountQuery';
import { AccountQuery as AccountMySQLQuery } from './MySQL/AccountQuery';

@injectable()
export class AccountQuery implements IAccountQuery {
  private accountMySQLQuery: AccountMySQLQuery;

  public constructor(@inject(TYPE.AccountMySQLQuery) accountMySQLQuery: AccountMySQLQuery) {
    this.accountMySQLQuery = accountMySQLQuery;
  }

  public async findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError>> {
    return this.accountMySQLQuery.findByAccount(account);
  }
}

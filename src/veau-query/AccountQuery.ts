import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { AccountError } from '../veau-error/AccountError';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Try } from '../veau-general/Try/Try';
import { Account } from '../veau-vo/Account';
import { AccountName } from '../veau-vo/AccountName';
import { IAccountQuery } from './interfaces/IAccountQuery';

@injectable()
export class AccountQuery implements IAccountQuery {
  private accountQuery: IAccountQuery;

  public constructor(@inject(TYPE.AccountMySQLQuery) accountQuery: IAccountQuery) {
    this.accountQuery = accountQuery;
  }

  public findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError>> {
    return this.accountQuery.findByAccount(account);
  }
}

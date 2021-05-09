import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Inject, Injectable } from '@nestjs/common';
import { Type } from '../container/Types';
import { Account } from '../domain/vo/Account/Account';
import { AccountName } from '../domain/vo/Account/AccountName';
import { AccountError } from '../domain/vo/Account/error/AccountError';
import { Password } from '../domain/vo/EntranceInformation/Password';
import { VeauAccount } from '../domain/vo/VeauAccount/VeauAccount';
import { NoSuchElementError } from '../repository/query/error/NoSuchElementError';
import { IAccountQuery } from '../repository/query/interface/IAccountQuery';

@Injectable()
export class AuthenticationInteractor {
  private readonly accountQuery: IAccountQuery;

  public constructor(@Inject(Type.AccountMySQLQuery) accountQuery: IAccountQuery) {
    this.accountQuery = accountQuery;
  }

  public review(name: AccountName, pass: Password): Superposition<VeauAccount, AccountError | DataSourceError | NoSuchElementError> {
    return this.accountQuery.findByAccount(name).map<VeauAccount, DataSourceError | NoSuchElementError | AccountError>(async (account: Account) => {
      const correct: boolean = await account.verify(pass);

      if (correct) {
        return account.getVeauAccount();
      }

      throw new AccountError(`NO SUCH ACCOUNT. GIVEN: ${name.toString()}`);
    });
  }
}

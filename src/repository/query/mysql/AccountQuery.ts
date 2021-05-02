import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { Account, AccountRow } from '../../../domain/vo/Account/Account';
import { AccountName } from '../../../domain/vo/Account/AccountName';
import { AccountError } from '../../../domain/vo/Account/error/AccountError';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IAccountQuery } from '../Interface/IAccountQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

@injectable()
export class AccountQuery implements IAccountQuery<MySQLError>, IMySQLQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public findByAccount(account: AccountName): Superposition<Account, AccountError | MySQLError | NoSuchElementError> {
    const query: string = `SELECT
      R1.veau_account_id AS veauAccountID,
      R1.language_id AS languageID,
      R1.region_id AS regionID,
      R1.account AS name,
      R2.hash
      FROM veau_accounts R1
      INNER JOIN veau_account_hashes R2
      USING(veau_account_id)
      WHERE R1.account = :account
      AND R1.active = true;`;

    return Superposition.playground<Array<AccountRow>, MySQLError>(() => {
      return this.mysql.execute<Array<AccountRow>>(query, {
        account: account.get()
      });
    }, MySQLError).map<Account, AccountError | MySQLError | NoSuchElementError>((rows: Array<AccountRow>) => {
      if (rows.length === 0) {
        throw new NoSuchElementError(account.get());
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Account.ofRow(rows[0]!);
    }, AccountError, NoSuchElementError);
  }
}

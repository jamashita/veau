import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { IMySQL, MySQLError } from '@jamashita/publikum-mysql';

import { Type } from '../../Container/Types';
import { Account, AccountRow } from '../../VO/Account/Account';
import { AccountName } from '../../VO/Account/AccountName';
import { AccountError } from '../../VO/Account/Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IAccountQuery } from '../Interface/IAccountQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

@injectable()
export class AccountQuery implements IAccountQuery, IMySQLQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async findByAccount(
    account: AccountName
  ): Promise<Superposition<Account, AccountError | NoSuchElementError | DataSourceError>> {
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

    const superposition: Superposition<Array<AccountRow>, MySQLError> = await Schrodinger.sandbox<
      Array<AccountRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<AccountRow>>(query, {
        account: account.get()
      });
    });

    return superposition.transform<Account, AccountError | NoSuchElementError | DataSourceError>(
      (rows: Array<AccountRow>) => {
        if (rows.length === 0) {
          return Dead.of<Account, NoSuchElementError>(new NoSuchElementError(account.get()));
        }

        return Account.ofRow(rows[0]);
      },
      (err: MySQLError) => {
        return Dead.of<Account, MySQLError>(err);
      }
    );
  }
}

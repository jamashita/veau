import { inject, injectable } from 'inversify';
import { DataSourceError, Dead, IMySQL, MySQLError, Schrodinger, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { AccountError } from '../../VO/Account/Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { Account, AccountRow } from '../../VO/Account/Account';
import { AccountName } from '../../VO/Account/AccountName';
import { IAccountQuery } from '../Interface/IAccountQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

@injectable()
export class AccountQuery implements IAccountQuery, IMySQLQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async findByAccount(
    account: AccountName
  ): Promise<Superposition<Account, AccountError | NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.veau_account_id AS veauAccountID,
      R3.language_id AS languageID,
      R4.region_id AS regionID,
      R1.account AS name,
      R2.hash
      FROM veau_accounts R1
      INNER JOIN veau_account_hashes R2
      USING(veau_account_id)
      INNER JOIN languages R3
      USING(language_id)
      INNER JOIN regions R4
      USING(region_id)
      WHERE R1.account = :account
      AND R1.active = true;`;

    const superposition: Superposition<Array<AccountRow>, MySQLError> = await Schrodinger.playground<
      Array<AccountRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<AccountRow>>(query, {
        account: account.get()
      });
    });

    return superposition.match<Account, AccountError | NoSuchElementError | DataSourceError>(
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

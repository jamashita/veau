import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { AccountError } from '../../veau-error/AccountError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { IMySQL } from '../../veau-general/MySQL/interfaces/IMySQL';
import { MySQLError } from '../../veau-general/MySQL/MySQLError';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { Account, AccountRow } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';
import { IAccountQuery } from '../interfaces/IAccountQuery';
import { IMySQLQuery } from '../interfaces/IMySQLQuery';

@injectable()
export class AccountQuery implements IAccountQuery<MySQLError>, IMySQLQuery {
  public readonly noun: 'AccountQuery' = 'AccountQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError | MySQLError>> {
    const query: string = `SELECT
      R1.veau_account_id AS veauAccountID,
      R1.account,
      R3.language_id AS languageID,
      R3.name AS languageName,
      R3.english_name AS languageEnglishName,
      R3.iso639,
      R4.region_id AS regionID,
      R4.name AS regionName,
      R4.iso3166,
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

    try {
      const accountRows: Array<AccountRow> = await this.mysql.execute<Array<AccountRow>>(query, {
        account: account.get()
      });

      if (accountRows.length === 0) {
        return Failure.of<Account, NoSuchElementError>(new NoSuchElementError(account.get()));
      }

      return Account.ofRow(accountRows[0]);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<Account, MySQLError>(err);
      }

      throw err;
    }
  }
}

import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { AccountError } from '../../veau-error/AccountError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { Account, AccountRow } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';
import { IAccountQuery } from '../IAccountQuery';

@injectable()
export class AccountQuery implements IAccountQuery {
  private mysql: MySQL;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL) {
    this.mysql = mysql;
  }

  public async findByAccount(account: AccountName): Promise<Try<Account, NoSuchElementError | AccountError>> {
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

    const accountRows: Array<AccountRow> = await this.mysql.execute<Array<AccountRow>>(query, {
      account: account.get()
    });

    if (accountRows.length === 0) {
      return Failure.of<Account, NoSuchElementError>(new NoSuchElementError(account.get()));
    }

    const accountRow: AccountRow = accountRows[0];

    return Account.ofRow(accountRow);
  }
}

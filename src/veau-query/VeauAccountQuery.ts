import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { VeauAccount, VeauAccountRow } from '../veau-vo/VeauAccount';

export type VeauAccountHash = {
  veauAccount: VeauAccount;
  hash: string;
};

@injectable()
export class VeauAccountQuery {
  private mysql: MySQL;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL) {
    this.mysql = mysql;
  }

  public async findByAccount(account: string): Promise<VeauAccountHash> {
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

    const veauAccountRows: Array<VeauAccountRow> = await this.mysql.execute<Array<VeauAccountRow>>(query, {
      account
    });

    if (veauAccountRows.length === 0) {
      throw new NoSuchElementError(account);
    }

    const veauAccountRow: VeauAccountRow = veauAccountRows[0];

    return {
      veauAccount: VeauAccount.ofRow(veauAccountRow),
      hash: veauAccountRow.hash
    };
  }
}

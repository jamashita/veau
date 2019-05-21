import { VeauAccount, VeauAccountRow } from '../veau-entity/VeauAccount';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { VeauAccountFactory } from '../veau-factory/VeauAccountFactory';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';

const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

export type VeauAccountHash = {
  veauAccount: VeauAccount;
  hash: string;
};

export class VeauAccountQuery {
  private static instance: VeauAccountQuery = new VeauAccountQuery();

  public static getInstance(): VeauAccountQuery {
    return VeauAccountQuery.instance;
  }

  private constructor() {
  }

  public async findByAccount(account: string): Promise<VeauAccountHash> {
    const query: string = `SELECT
      R1.veau_account_id AS veauAccountID,
      R1.account,
      R2.language_id AS languageID,
      R2.name AS languageName,
      R2.english_name AS languageEnglishName,
      R2.iso639,
      R3.region_id AS regionID,
      R3.name AS regionName,
      R3.iso3166,
      R1.hash
      FROM veau_accounts R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN regions R3
      USING(region_id)
      WHERE R1.account = :account
      AND R1.active = true;`;

    const veauAccountRows: Array<VeauAccountRow> = await veauMySQL.execute(query, {
      account
    });

    if (veauAccountRows.length === 0) {
      throw new NoSuchElementError(account);
    }

    const veauAccountRow: VeauAccountRow = veauAccountRows[0];

    return {
      veauAccount: veauAccountFactory.fromRow(veauAccountRow),
      hash: veauAccountRow.hash
    };
  }
}

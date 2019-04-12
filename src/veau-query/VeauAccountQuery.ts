import { VeauAccount, VeauAccountRow } from '../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../veau-factory/VeauAccountFactory';
import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IVeauAccountQuery } from './interfaces/IVeauAccountQuery';

const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

export type VeauAccountHash = {
  veauAccount: VeauAccount;
  hash: string;
};

export class VeauAccountQuery implements IVeauAccountQuery {

  public static getInstance(): VeauAccountQuery {
    return new VeauAccountQuery();
  }

  private constructor() {
  }

  public async findByAccount(account: string): Promise<VeauAccountHash> {
    const query: string = `SELECT
      R1.veau_account_id AS id,
      R1.account,
      R2.iso639 AS language,
      R3.iso3166 AS region,
      R1.hash
      FROM veau_accounts R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN regions R3
      USING(region_id)
      WHERE R1.account = :account
      AND R1.active = true;`;

    const veauAccountRows: Array<VeauAccountRow> = await VeauMySQL.query(query, [
      {
        account
      }
    ]);

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

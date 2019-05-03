import { VeauAccountRow } from '../veau-entity/VeauAccount';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { VeauAccountFactory } from '../veau-factory/VeauAccountFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { IVeauAccountQuery, VeauAccountHash } from './interfaces/IVeauAccountQuery';

export class VeauAccountMySQLQuery implements IVeauAccountQuery {
  private static instance: VeauAccountMySQLQuery = new VeauAccountMySQLQuery();
  private static veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

  public static getInstance(): VeauAccountMySQLQuery {
    return VeauAccountMySQLQuery.instance;
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
      veauAccount: VeauAccountMySQLQuery.veauAccountFactory.fromRow(veauAccountRow),
      hash: veauAccountRow.hash
    };
  }
}

import {VeauAccount, VeauAccountRow} from '../veau-entity/VeauAccount';
import {VeauAccountFactory} from '../veau-factory/VeauAccountFactory';
import {NoSuchElementError} from '../veau-general/Error';
import {VeauMySQL} from '../veau-infrastructure/VeauMySQL';

const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

export type VeauAccountHash = {
  veauAccount: VeauAccount;
  hash: string;
}

export class VeauAccountRepository implements IVeauAccountRepository {
  private static instance: VeauAccountRepository = new VeauAccountRepository();

  public static getInstance(): VeauAccountRepository {
    return VeauAccountRepository.instance;
  }

  private constructor() {
  }

  public async findByAccount(account: string): Promise<VeauAccountHash> {
    const query = `SELECT
      R1.veau_account_id AS id,
      R1.account,
      R2.iso639 AS language,
      R3.iso3166 AS locale,
      R1.active,
      R1.hash
      FROM veau_accounts R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN locales R3
      USING(locale_id)
      WHERE R1.account = :account;`;

    const veauAccountRows: Array<VeauAccountRow> = await VeauMySQL.query(query, [
      {
        account
      }
    ]);

    if (veauAccountRows.length === 0) {
      throw new NoSuchElementError(account);
    }

    return {
      veauAccount: veauAccountFactory.fromRow(veauAccountRows[0]),
      hash: veauAccountRows[0].hash
    }
  }
}

export interface IVeauAccountRepository {

  findByAccount(account: string): Promise<VeauAccountHash>;
}

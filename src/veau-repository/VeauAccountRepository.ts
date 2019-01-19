import {VeauAccount, VeauAccountRow} from '../veau-entity/VeauAccount';
import {VeauAccountFactory} from '../veau-factory/VeauAccountFactory';
import {NoSuchElementError} from '../veau-general/Error';
import {VeauMySQL} from '../veau-infrastructure/VeauMySQL';

const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

export class VeauAccountRepository implements IVeauAccountRepository {
  private static instance: VeauAccountRepository = new VeauAccountRepository();

  public static getInstance(): VeauAccountRepository {
    return VeauAccountRepository.instance;
  }

  private constructor() {
  }

  public async findByName(name: string): Promise<VeauAccount> {
    const query = `SELECT
      R1.veau_account_id AS id
      R1.account,
      R1.language_id AS languageID,
      R1.locale_id AS localeID,
      R1.active
      FROM veau_accounts R1
      WHERE R1.name = :name;`;

    const rows: Array<VeauAccountRow> = await VeauMySQL.query(query, [
      {
        name
      }
    ]);

    if (rows.length === 0) {
      throw new NoSuchElementError(name);
    }

    return veauAccountFactory.fromRow(rows[0]);
  }
}

export interface IVeauAccountRepository {

  findByName(name: string): Promise<VeauAccount>;
}

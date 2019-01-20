import { VeauAccount, VeauAccountJSON, VeauAccountRow } from '../veau-entity/VeauAccount';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

export class VeauAccountFactory {
  private static instance: VeauAccountFactory = new VeauAccountFactory();

  public static getInstance(): VeauAccountFactory {
    return VeauAccountFactory.instance;
  }

  private constructor() {
  }

  public from(veauAccountID: VeauAccountID, name: string, language: ISO639, region: ISO3166): VeauAccount {
    return new VeauAccount(veauAccountID, name, language, region);
  }

  public fromJSON(json: VeauAccountJSON): VeauAccount {
    const {
      id,
      account,
      language,
      region
    } = json;

    return this.from(VeauAccountID.of(id), account, ISO639.of(language), ISO3166.of(region));
  }

  public fromRow(row: VeauAccountRow): VeauAccount {
    const {
      id,
      account,
      language,
      region
    } = row;

    return this.from(VeauAccountID.of(id), account, ISO639.of(language), ISO3166.of(region));
  }
}

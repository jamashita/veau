import {VeauAccount, VeauAccountJSON, VeauAccountRow} from '../veau-entity/VeauAccount';
import {ISO3166} from '../veau-vo/ISO3166';
import {ISO639} from '../veau-vo/ISO639';
import {VeauAccountID} from '../veau-vo/VeauAccountID';

export class VeauAccountFactory {
  private static instance: VeauAccountFactory = new VeauAccountFactory();

  public static getInstance(): VeauAccountFactory {
    return VeauAccountFactory.instance;
  }

  private constructor() {
  }

  public from(veauAccountID: VeauAccountID, name: string, language: ISO639, locale: ISO3166, active: boolean): VeauAccount {
    return new VeauAccount(veauAccountID, name, language, locale, active);
  }

  public fromJSON(json: VeauAccountJSON): VeauAccount {
    const {
      id,
      account,
      language,
      locale,
      active
    } = json;

    return this.from(VeauAccountID.of(id), account, ISO639.of(language), ISO3166.of(locale), active);
  }

  public fromRow(row: VeauAccountRow): VeauAccount {
    const {
      id,
      account,
      language,
      locale,
      active
    } = row;

    return this.from(VeauAccountID.of(id), account, ISO639.of(language), ISO3166.of(locale), Boolean(active));
  }
}

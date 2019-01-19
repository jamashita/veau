import {VeauAccount, VeauAccountJSON, VeauAccountRow} from '../veau-entity/VeauAccount';
import {LanguageID} from '../veau-vo/LanguageID';
import {LocaleID} from '../veau-vo/LocaleID';
import {VeauAccountID} from '../veau-vo/VeauAccountID';

export class VeauAccountFactory {
  private static instance: VeauAccountFactory = new VeauAccountFactory();

  public static getInstance(): VeauAccountFactory {
    return VeauAccountFactory.instance;
  }

  private constructor() {
  }

  public from(veauAccountID: VeauAccountID, name: string, hash: string, languageID: LanguageID, localeID: LocaleID, active: boolean): VeauAccount {
    return new VeauAccount(veauAccountID, name, hash, languageID, localeID, active);
  }

  public fromJSON(json: VeauAccountJSON): VeauAccount {
    const {
      id,
      name,
      hash,
      languageID,
      localeID,
      active
    } = json;

    return this.from(VeauAccountID.of(id), name, hash, LanguageID.of(languageID), LocaleID.of(localeID), active);
  }

  public fromRow(row: VeauAccountRow): VeauAccount {
    const {
      id,
      name,
      hash,
      languageID,
      localeID,
      active
    } = row;

    return this.from(VeauAccountID.of(id), name, hash, LanguageID.of(languageID), LocaleID.of(localeID), active);
  }
}

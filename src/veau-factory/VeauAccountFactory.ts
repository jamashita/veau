import { Language } from '../veau-entity/Language';
import { Region } from '../veau-entity/Region';
import { VeauAccount, VeauAccountJSON, VeauAccountRow } from '../veau-entity/VeauAccount';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { LanguageID } from '../veau-vo/LanguageID';
import { RegionID } from '../veau-vo/RegionID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';

export class VeauAccountFactory {
  private static instance: VeauAccountFactory = new VeauAccountFactory();

  public static getInstance(): VeauAccountFactory {
    return VeauAccountFactory.instance;
  }

  private constructor() {
  }

  public from(veauAccountID: VeauAccountID, name: string, language: Language, region: Region): VeauAccount {
    return new VeauAccount(veauAccountID, name, language, region);
  }

  public fromJSON(json: VeauAccountJSON): VeauAccount {
    const {
      veauAccountID,
      account,
      language,
      region
    } = json;

    return this.from(VeauAccountID.of(veauAccountID), account, Language.fromJSON(language), Region.fromJSON(region));
  }

  public fromRow(row: VeauAccountRow): VeauAccount {
    const {
      veauAccountID,
      account,
      languageID,
      languageName,
      languageEnglishName,
      iso639,
      regionID,
      regionName,
      iso3166
    } = row;

    const language: Language = Language.from(LanguageID.of(languageID), languageName, languageEnglishName, ISO639.of(iso639));
    const region: Region = Region.from(RegionID.of(regionID), regionName, ISO3166.of(iso3166));

    return this.from(VeauAccountID.of(veauAccountID), account, language, region);
  }
}

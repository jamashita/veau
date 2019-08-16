import { AccountName } from '../veau-vo/AccountName';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { LanguageID } from '../veau-vo/LanguageID';
import { LanguageName } from '../veau-vo/LanguageName';
import { RegionID } from '../veau-vo/RegionID';
import { RegionName } from '../veau-vo/RegionName';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { Entity } from './Entity';
import { Language, LanguageJSON } from './Language';
import { Region, RegionJSON } from './Region';

export type VeauAccountJSON = {
  veauAccountID: string;
  account: string;
  language: LanguageJSON;
  region: RegionJSON;
};

export type VeauAccountRow = {
  veauAccountID: string;
  account: string;
  languageID: number;
  languageName: string;
  languageEnglishName: string;
  iso639: string;
  regionID: number;
  regionName: string;
  iso3166: string;
  hash: string;
};

export class VeauAccount extends Entity<VeauAccountID> {
  private veauAccountID: VeauAccountID;
  private account: AccountName;
  private language: Language;
  private region: Region;

  public static from(veauAccountID: VeauAccountID, name: AccountName, language: Language, region: Region): VeauAccount {
    return new VeauAccount(veauAccountID, name, language, region);
  }

  public static fromJSON(json: VeauAccountJSON): VeauAccount {
    const {
      veauAccountID,
      account,
      language,
      region
    }: VeauAccountJSON = json;

    return VeauAccount.from(VeauAccountID.of(veauAccountID), AccountName.of(account), Language.fromJSON(language), Region.fromJSON(region));
  }

  public static fromRow(row: VeauAccountRow): VeauAccount {
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
    }: VeauAccountRow = row;

    const language: Language = Language.from(LanguageID.of(languageID), LanguageName.of(languageName), LanguageName.of(languageEnglishName), ISO639.of(iso639));
    const region: Region = Region.from(RegionID.of(regionID), RegionName.of(regionName), ISO3166.of(iso3166));

    return VeauAccount.from(VeauAccountID.of(veauAccountID), AccountName.of(account), language, region);
  }

  public static default(): VeauAccount {
    return VeauAccount.from(VeauAccountID.default(), AccountName.default(), Language.default(), Region.default());
  }

  private constructor(veauAccountID: VeauAccountID, account: AccountName, language: Language, region: Region) {
    super();
    this.veauAccountID = veauAccountID;
    this.account = account;
    this.language = language;
    this.region = region;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getAccount(): AccountName {
    return this.account;
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getRegion(): Region {
    return this.region;
  }

  public getIdentifier(): VeauAccountID {
    return this.veauAccountID;
  }

  public isDefault(): boolean {
    if (this.getVeauAccountID().equals(VeauAccountID.default())) {
      return true;
    }

    return false;
  }

  public copy(): VeauAccount {
    const {
      veauAccountID,
      account,
      language,
      region
    }: this = this;

    return new VeauAccount(veauAccountID, account, language, region);
  }

  public toJSON(): VeauAccountJSON {
    const {
      veauAccountID,
      account,
      language,
      region
    }: this = this;

    return {
      veauAccountID: veauAccountID.get(),
      account: account.get(),
      language: language.toJSON(),
      region: region.toJSON()
    };
  }

  public toString(): string {
    const {
      veauAccountID,
      account,
      language,
      region
    }: this = this;

    return `${veauAccountID.toString()} ${account.toString()} ${language.toString()} ${region.toString()}`;
  }
}

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
  private account: string;
  private language: Language;
  private region: Region;

  public static default(): VeauAccount {
    return new VeauAccount(VeauAccountID.default(), '', Language.default(), Region.default());
  }

  public constructor(veauAccountID: VeauAccountID, account: string, language: Language, region: Region) {
    super();
    this.veauAccountID = veauAccountID;
    this.account = account;
    this.language = language;
    this.region = region;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getAccount(): string {
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
    } = this;

    return new VeauAccount(veauAccountID, account, language, region);
  }

  public toJSON(): VeauAccountJSON {
    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    return {
      veauAccountID: veauAccountID.get(),
      account,
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
    } = this;

    return `${veauAccountID.toString()} ${account} ${language.toString()} ${region.toString()}`;
  }
}

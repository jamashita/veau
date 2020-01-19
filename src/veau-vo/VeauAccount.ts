import { JSONable } from '../veau-general/JSONable';
import { ValueObject } from '../veau-general/ValueObject';
import { AccountName } from './AccountName';
import { Language, LanguageJSON } from './Language';
import { Region, RegionJSON } from './Region';
import { VeauAccountID } from './VeauAccountID';

export type VeauAccountJSON = {
  veauAccountID: string;
  account: string;
  language: LanguageJSON;
  region: RegionJSON;
};

export class VeauAccount extends ValueObject implements JSONable {
  private veauAccountID: VeauAccountID;
  private account: AccountName;
  private language: Language;
  private region: Region;

  public static of(veauAccountID: VeauAccountID, name: AccountName, language: Language, region: Region): VeauAccount {
    return new VeauAccount(veauAccountID, name, language, region);
  }

  public static ofJSON(json: VeauAccountJSON): VeauAccount {
    const {
      veauAccountID,
      account,
      language,
      region
    } = json;

    return VeauAccount.of(VeauAccountID.of(veauAccountID), AccountName.of(account), Language.ofJSON(language), Region.ofJSON(region));
  }

  public static default(): VeauAccount {
    return VeauAccount.of(VeauAccountID.generate(), AccountName.default(), Language.default(), Region.default());
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

  public equals(other: VeauAccount): boolean {
    if (this === other) {
      return true;
    }

    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    if (!veauAccountID.equals(other.getVeauAccountID())) {
      return false;
    }
    if (!account.equals(other.getAccount())) {
      return false;
    }
    if (!language.equals(other.getLanguage())) {
      return false;
    }
    if (!region.equals(other.getRegion())) {
      return false;
    }

    return true;
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
    } = this;

    return `${veauAccountID.toString()} ${account.toString()} ${language.toString()} ${region.toString()}`;
  }
}

import { Digest } from '../veau-general/Digest';
import { ValueObject } from '../veau-general/ValueObject';
import { AccountName } from './AccountName';
import { Hash } from './Hash';
import { ISO3166 } from './ISO3166';
import { ISO639 } from './ISO639';
import { Language } from './Language';
import { LanguageID } from './LanguageID';
import { LanguageName } from './LanguageName';
import { Password } from './Password';
import { Region } from './Region';
import { RegionID } from './RegionID';
import { RegionName } from './RegionName';
import { VeauAccount } from './VeauAccount';
import { VeauAccountID } from './VeauAccountID';

export type AccountRow = {
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

export class Account extends ValueObject {
  private veauAccountID: VeauAccountID;
  private account: AccountName;
  private language: Language;
  private region: Region;
  private hash: Hash;

  public static of(veauAccountID: VeauAccountID, account: AccountName, language: Language, region: Region, hash: Hash): Account {
    return new Account(veauAccountID, account, language, region, hash);
  }

  public static ofRow(row: AccountRow): Account {
    const {
      veauAccountID,
      account,
      languageID,
      languageName,
      languageEnglishName,
      iso639,
      regionID,
      regionName,
      iso3166,
      hash
    } = row;

    const language: Language = Language.of(LanguageID.of(languageID), LanguageName.of(languageName), LanguageName.of(languageEnglishName), ISO639.of(iso639));
    const region: Region = Region.of(RegionID.of(regionID), RegionName.of(regionName), ISO3166.of(iso3166));

    return Account.of(VeauAccountID.of(veauAccountID), AccountName.of(account), language, region, Hash.of(hash));
  }

  private constructor(veauAccountID: VeauAccountID, account: AccountName, language: Language, region: Region, hash: Hash) {
    super();
    this.veauAccountID = veauAccountID;
    this.account = account;
    this.language = language;
    this.region = region;
    this.hash = hash;
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

  public getHash(): Hash {
    return this.hash;
  }

  public verify(password: Password): Promise<boolean> {
    return Digest.compare(password.get(), this.hash.get());
  }

  public toVeauAccount(): VeauAccount {
    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    return VeauAccount.of(veauAccountID, account, language, region);
  }

  public equals(other: Account): boolean {
    if (this === other) {
      return true;
    }

    const {
      veauAccountID,
      account,
      language,
      region,
      hash
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
    if (!hash.equals(other.getHash())) {
      return false;
    }

    return true;
  }

  public toString(): string {
    const {
      veauAccountID,
      account,
      language,
      region,
      hash
    } = this;

    return `${veauAccountID.toString()} ${account.toString()} ${language.toString()} ${region.toString()} ${hash.toString()}`;
  }
}

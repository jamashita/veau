import { AccountError } from '../veau-error/AccountError';
import { VeauAccountIDError } from '../veau-error/VeauAccountIDError';
import { Digest } from '../veau-general/Digest';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ValueObject } from '../veau-general/ValueObject';
import { AccountName } from './AccountName';
import { Hash } from './Hash';
import { Language } from './Language';
import { Password } from './Password';
import { Region } from './Region';
import { VeauAccount } from './VeauAccount';
import { VeauAccountID } from './VeauAccountID';

export type AccountRow = Readonly<{
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
}>;

export class Account extends ValueObject {
  public readonly noun: 'Account' = 'Account';
  private readonly veauAccountID: VeauAccountID;
  private readonly account: AccountName;
  private readonly language: Language;
  private readonly region: Region;
  private readonly hash: Hash;

  public static of(
    veauAccountID: VeauAccountID,
    account: AccountName,
    language: Language,
    region: Region,
    hash: Hash
  ): Account {
    return new Account(veauAccountID, account, language, region, hash);
  }

  public static ofRow(row: AccountRow): Try<Account, AccountError> {
    return VeauAccountID.ofString(row.veauAccountID).match<Try<Account, AccountError>>((veauAccountID: VeauAccountID) => {
      const language: Language = Language.ofRow({
        languageID: row.languageID,
        name: row.languageName,
        englishName: row.languageEnglishName,
        iso639: row.iso639
      });
      const region: Region = Region.ofRow({
        regionID: row.regionID,
        name: row.regionName,
        iso3166: row.iso3166
      });

      return Success.of<Account, AccountError>(
        Account.of(
          veauAccountID,
          AccountName.of(row.account),
          language,
          region,
          Hash.of(row.hash)
        )
      );
    }, (err: VeauAccountIDError) => {
      return Failure.of<Account, AccountError>(new AccountError(err.message));
    });
  }

  protected constructor(
    veauAccountID: VeauAccountID,
    account: AccountName,
    language: Language,
    region: Region,
    hash: Hash
  ) {
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

    if (!veauAccountID.equals(other.veauAccountID)) {
      return false;
    }
    if (!account.equals(other.account)) {
      return false;
    }
    if (!language.equals(other.language)) {
      return false;
    }
    if (!region.equals(other.region)) {
      return false;
    }
    if (!hash.equals(other.hash)) {
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

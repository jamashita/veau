import { Alive, Dead, Digest, Superposition, ValueObject } from 'publikum';
import { AccountError } from '../Error/AccountError';
import { LanguageIDError } from '../Error/LanguageIDError';
import { RegionIDError } from '../Error/RegionIDError';
import { VeauAccountIDError } from '../Error/VeauAccountIDError';
import { AccountName } from './AccountName';
import { Hash } from './Hash';
import { LanguageID } from './LanguageID';
import { Password } from './Password';
import { RegionID } from './RegionID';
import { VeauAccount } from './VeauAccount';
import { VeauAccountID } from './VeauAccountID';

export type AccountRow = Readonly<{
  veauAccountID: string;
  languageID: string;
  regionID: string;
  account: string;
  hash: string;
}>;

export class Account extends ValueObject {
  public readonly noun: 'Account' = 'Account';
  private readonly veauAccountID: VeauAccountID;
  private readonly languageID: LanguageID;
  private readonly regionID: RegionID;
  private readonly account: AccountName;
  private readonly hash: Hash;

  public static of(
    veauAccountID: VeauAccountID,
    languageID: LanguageID,
    regionID: RegionID,
    account: AccountName,
    hash: Hash
  ): Account {
    return new Account(
      veauAccountID,
      languageID,
      regionID,
      account,
      hash
    );
  }

  public static ofRow(row: AccountRow): Superposition<Account, AccountError> {
    return VeauAccountID.ofString(row.veauAccountID).match<Account, AccountError>((veauAccountID: VeauAccountID) => {
      return LanguageID.ofString(row.languageID).match<Account, AccountError>((languageID: LanguageID) => {
        return RegionID.ofString(row.regionID).match<Account, AccountError>((regionID: RegionID) => {
          return Alive.of<Account, AccountError>(
            Account.of(
              veauAccountID,
              languageID,
              regionID,
              AccountName.of(row.account),
              Hash.of(row.hash)
            )
          );
        }, (err: RegionIDError) => {
          return Dead.of<Account, AccountError>(
            new AccountError('Account.ofRow()', err)
          );
        });
      }, (err: LanguageIDError) => {
        return Dead.of<Account, AccountError>(
          new AccountError('Account.ofRow()', err)
        );
      });
    }, (err: VeauAccountIDError) => {
      return Dead.of<Account, AccountError>(
        new AccountError('Account.ofRow()', err)
      );
    });
  }

  protected constructor(
    veauAccountID: VeauAccountID,
    languageID: LanguageID,
    regionID: RegionID,
    account: AccountName,
    hash: Hash
  ) {
    super();
    this.veauAccountID = veauAccountID;
    this.account = account;
    this.languageID = languageID;
    this.regionID = regionID;
    this.hash = hash;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public getAccount(): AccountName {
    return this.account;
  }

  public getHash(): Hash {
    return this.hash;
  }

  public verify(password: Password): Promise<boolean> {
    return Digest.compare(password.get(), this.hash.get());
  }

  public toVeauAccount(): VeauAccount {
    return VeauAccount.of(
      this.veauAccountID,
      this.languageID,
      this.regionID,
      this.account
    );
  }

  public equals(other: Account): boolean {
    if (this === other) {
      return true;
    }
    if (!this.veauAccountID.equals(other.veauAccountID)) {
      return false;
    }
    if (!this.languageID.equals(other.languageID)) {
      return false;
    }
    if (!this.regionID.equals(other.regionID)) {
      return false;
    }
    if (!this.account.equals(other.account)) {
      return false;
    }
    if (!this.hash.equals(other.hash)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.veauAccountID.toString());
    properties.push(this.languageID.toString());
    properties.push(this.regionID.toString());
    properties.push(this.account.toString());
    properties.push(this.hash.toString());

    return properties.join(' ');
  }
}

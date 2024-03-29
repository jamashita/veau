import { ValueObject } from '@jamashita/anden-object';
import { Digest } from '@jamashita/steckdose-digest';
import { Password } from '../EntranceInformation/Password.js';
import { LanguageError } from '../Language/error/LanguageError.js';
import { LanguageID } from '../Language/LanguageID.js';
import { RegionError } from '../Region/error/RegionError.js';
import { RegionID } from '../Region/RegionID.js';
import { VeauAccountError } from '../VeauAccount/error/VeauAccountError.js';
import { VeauAccount } from '../VeauAccount/VeauAccount.js';
import { VeauAccountID } from '../VeauAccount/VeauAccountID.js';
import { AccountName } from './AccountName.js';
import { AccountError } from './error/AccountError.js';
import { Hash } from './Hash.js';

export type AccountRow = Readonly<{
  veauAccountID: string;
  languageID: string;
  regionID: string;
  name: string;
  hash: string;
}>;

export class Account extends ValueObject<'Account'> {
  public readonly noun: 'Account' = 'Account';
  private readonly account: VeauAccount;
  private readonly hash: Hash;

  public static of(account: VeauAccount, hash: Hash): Account {
    return new Account(account, hash);
  }

  public static ofRow(row: AccountRow): Account {
    try {
      return Account.of(
        VeauAccount.of(
          VeauAccountID.ofString(row.veauAccountID),
          LanguageID.ofString(row.languageID),
          RegionID.ofString(row.regionID),
          AccountName.of(row.name)
        ),
        Hash.of(row.hash)
      );
    }
    catch (err: unknown) {
      if (err instanceof VeauAccountError || err instanceof LanguageError || err instanceof RegionError) {
        throw new AccountError('Account.ofRow()', err);
      }
      throw err;
    }
  }

  protected constructor(account: VeauAccount, hash: Hash) {
    super();
    this.account = account;
    this.hash = hash;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Account)) {
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

    properties.push(this.account.toString());
    properties.push(this.hash.toString());

    return properties.join(' ');
  }

  public getAccountName(): AccountName {
    return this.account.getAccountName();
  }

  public getHash(): Hash {
    return this.hash;
  }

  public getLanguageID(): LanguageID {
    return this.account.getLanguageID();
  }

  public getRegionID(): RegionID {
    return this.account.getRegionID();
  }

  public getVeauAccount(): VeauAccount {
    return this.account;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.account.getVeauAccountID();
  }

  public verify(password: Password): Promise<boolean> {
    return Digest.compare(password.get(), this.hash.get());
  }
}

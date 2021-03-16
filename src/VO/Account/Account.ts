import { Digest } from '@jamashita/publikum-digest';
import { ValueObject } from '@jamashita/publikum-object';
import { Password } from '../EntranceInformation/Password';
import { LanguageError } from '../Language/Error/LanguageError';
import { LanguageID } from '../Language/LanguageID';
import { RegionError } from '../Region/Error/RegionError';
import { RegionID } from '../Region/RegionID';
import { VeauAccountError } from '../VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../VeauAccount/VeauAccount';
import { VeauAccountID } from '../VeauAccount/VeauAccountID';
import { AccountName } from './AccountName';
import { AccountError } from './Error/AccountError';
import { Hash } from './Hash';

export type AccountRow = Readonly<{
  veauAccountID: string;
  languageID: string;
  regionID: string;
  name: string;
  hash: string;
}>;

export class Account extends ValueObject<Account, 'Account'> {
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

  public equals(other: Account): boolean {
    if (this === other) {
      return true;
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

  public getVeauAccountID(): VeauAccountID {
    return this.account.getVeauAccountID();
  }

  public getLanguageID(): LanguageID {
    return this.account.getLanguageID();
  }

  public getRegionID(): RegionID {
    return this.account.getRegionID();
  }

  public getAccountName(): AccountName {
    return this.account.getAccountName();
  }

  public getVeauAccount(): VeauAccount {
    return this.account;
  }

  public getHash(): Hash {
    return this.hash;
  }

  public verify(password: Password): Promise<boolean> {
    return Digest.compare(password.get(), this.hash.get());
  }
}

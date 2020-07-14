import { Digest } from '@jamashita/publikum-digest';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';

import { Password } from '../EntranceInformation/Password';
import { LanguageIDError } from '../Language/Error/LanguageIDError';
import { LanguageID } from '../Language/LanguageID';
import { RegionIDError } from '../Region/Error/RegionIDError';
import { RegionID } from '../Region/RegionID';
import { VeauAccountIDError } from '../VeauAccount/Error/VeauAccountIDError';
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

  public static ofRow(row: AccountRow): Superposition<Account, AccountError> {
    return VeauAccountID.ofString(row.veauAccountID)
      .map<Account, VeauAccountIDError | LanguageIDError | RegionIDError>(
        (veauAccountID: VeauAccountID) => {
          return LanguageID.ofString(row.languageID).map<Account, LanguageIDError | RegionIDError>(
            (languageID: LanguageID) => {
              return RegionID.ofString(row.regionID).map<Account, RegionIDError>((regionID: RegionID) => {
                return Account.of(
                  VeauAccount.of(veauAccountID, languageID, regionID, AccountName.of(row.name)),
                  Hash.of(row.hash)
                );
              });
            },
            RegionIDError
          );
        },
        LanguageIDError,
        RegionIDError
      )
      .recover<Account, AccountError>((err: VeauAccountIDError | LanguageIDError | RegionIDError) => {
        throw new AccountError('Account.ofRow()', err);
      }, AccountError);
  }

  protected constructor(account: VeauAccount, hash: Hash) {
    super();
    this.account = account;
    this.hash = hash;
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
}

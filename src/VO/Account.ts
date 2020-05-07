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
  name: string;
  hash: string;
}>;

export class Account extends ValueObject {
  public readonly noun: 'Account' = 'Account';
  private readonly account: VeauAccount;
  private readonly hash: Hash;

  public static of(
    account: VeauAccount,
    hash: Hash
  ): Account {
    return new Account(
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
              VeauAccount.of(
                veauAccountID,
                languageID,
                regionID,
                AccountName.of(row.name)
              ),
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
    account: VeauAccount,
    hash: Hash
  ) {
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

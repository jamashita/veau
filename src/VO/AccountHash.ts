import { ValueObject } from '../General/ValueObject';
import { Hash } from './Hash';
import { VeauAccountID } from './VeauAccountID';

export class AccountHash extends ValueObject {
  public readonly noun: 'AccountHash' = 'AccountHash';
  private readonly veauAccountID: VeauAccountID;
  private readonly hash: Hash;

  public static of(veauAccountID: VeauAccountID, hash: Hash): AccountHash {
    return new AccountHash(veauAccountID, hash);
  }

  protected constructor(veauAccountID: VeauAccountID, hash: Hash) {
    super();
    this.veauAccountID = veauAccountID;
    this.hash = hash;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getHash(): Hash {
    return this.hash;
  }

  public equals(other: AccountHash): boolean {
    if (this === other) {
      return true;
    }

    const {
      veauAccountID,
      hash
    } = this;

    if (!veauAccountID.equals(other.veauAccountID)) {
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
      hash
    } = this;

    return `${veauAccountID.toString()} ${hash.toString()}`;
  }
}

import { ValueObject } from 'publikum';
import { Hash } from './Hash';
import { VeauAccountID } from '../VeauAccount/VeauAccountID';

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
    if (!this.veauAccountID.equals(other.veauAccountID)) {
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
    properties.push(this.hash.toString());

    return properties.join(' ');
  }
}
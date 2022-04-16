import { ValueObject } from '@jamashita/anden-object';
import { VeauAccountID } from '../VeauAccount/VeauAccountID.js';
import { Hash } from './Hash.js';

export class AccountHash extends ValueObject<'AccountHash'> {
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

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof AccountHash)) {
      return false;
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

  public getHash(): Hash {
    return this.hash;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }
}

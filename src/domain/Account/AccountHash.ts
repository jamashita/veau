import { ValueObject } from '@jamashita/anden-object';
import { VeauAccountID } from '../VeauAccount/VeauAccountID.js';
import { Hash } from './Hash.js';

export class AccountHash extends ValueObject {
  private readonly veauAccountID: VeauAccountID;
  private readonly h: Hash;

  public static of(veauAccountID: VeauAccountID, hash: Hash): AccountHash {
    return new AccountHash(veauAccountID, hash);
  }

  protected constructor(veauAccountID: VeauAccountID, hash: Hash) {
    super();
    this.veauAccountID = veauAccountID;
    this.h = hash;
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
    if (!this.h.equals(other.h)) {
      return false;
    }

    return true;
  }

  public getHash(): Hash {
    return this.h;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.veauAccountID.toString());
    properties.push(this.h.toString());

    return properties.join(', ');
  }
}

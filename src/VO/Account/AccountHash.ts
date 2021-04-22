import { ValueObject } from '@jamashita/anden-object';
import { VeauAccountID } from '../VeauAccount/VeauAccountID';
import { Hash } from './Hash';

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

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getHash(): Hash {
    return this.hash;
  }
}

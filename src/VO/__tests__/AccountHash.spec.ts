import { AccountHash } from '../AccountHash';
import { Hash } from '../Hash';
import { VeauAccountID } from '../VeauAccountID';
import { MockVeauAccountID } from '../Mock/MockVeauAccountID';
import { MockHash } from '../Mock/MockHash';

describe('AccountHash', () => {
  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const account1: MockVeauAccountID = new MockVeauAccountID();
      const account2: MockVeauAccountID = new MockVeauAccountID();
      const hash1: Hash = new MockHash('hash 1');
      const hash2: Hash = new MockHash('hash 2');

      const accountHash1: AccountHash = AccountHash.of(account1, hash1);
      const accountHash2: AccountHash = AccountHash.of(account2, hash1);
      const accountHash3: AccountHash = AccountHash.of(account1, hash2);
      const accountHash4: AccountHash = AccountHash.of(account2, hash2);
      const accountHash5: AccountHash = AccountHash.of(account1, hash1);

      expect(accountHash1.equals(accountHash1)).toEqual(true);
      expect(accountHash1.equals(accountHash2)).toEqual(false);
      expect(accountHash1.equals(accountHash3)).toEqual(false);
      expect(accountHash1.equals(accountHash4)).toEqual(false);
      expect(accountHash1.equals(accountHash5)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const h: string = 'hash';
      const account: VeauAccountID = VeauAccountID.ofString(id).get();
      const hash: Hash = Hash.of(h);

      const accountHash: AccountHash = AccountHash.of(account, hash);

      expect(accountHash.toString()).toEqual(`${id} ${h}`);
    });
  });
});

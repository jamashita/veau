import { AccountHash } from '../AccountHash';
import { Hash } from '../Hash';
import { MockHash } from '../Mock/MockHash';
import { MockVeauAccountID } from '../Mock/MockVeauAccountID';
import { VeauAccountID } from '../VeauAccountID';

describe('AccountHash', () => {
  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const account1: MockVeauAccountID = new MockVeauAccountID();
      const account2: MockVeauAccountID = new MockVeauAccountID();
      const hash1: MockHash = new MockHash('hash 1');
      const hash2: MockHash = new MockHash('hash 2');

      const accountHash1: AccountHash = AccountHash.of(account1, hash1);
      const accountHash2: AccountHash = AccountHash.of(account2, hash1);
      const accountHash3: AccountHash = AccountHash.of(account1, hash2);
      const accountHash4: AccountHash = AccountHash.of(account2, hash2);
      const accountHash5: AccountHash = AccountHash.of(account1, hash1);

      expect(accountHash1.equals(accountHash1)).toBe(true);
      expect(accountHash1.equals(accountHash2)).toBe(false);
      expect(accountHash1.equals(accountHash3)).toBe(false);
      expect(accountHash1.equals(accountHash4)).toBe(false);
      expect(accountHash1.equals(accountHash5)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const hash: string = 'hash';

      const accountHash: AccountHash = AccountHash.of(VeauAccountID.ofString(id).get(), Hash.of(hash));

      expect(accountHash.toString()).toBe(`${id} ${hash}`);
    });
  });
});

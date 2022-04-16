import { MockVeauAccountID } from '../../VeauAccount/mock/MockVeauAccountID';
import { VeauAccountID } from '../../VeauAccount/VeauAccountID';
import { AccountHash } from '../AccountHash';
import { Hash } from '../Hash';

describe('AccountHash', () => {
  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const accountHash: AccountHash = AccountHash.of(new MockVeauAccountID(), Hash.of('hash'));

      expect(accountHash.equals(null)).toBe(false);
      expect(accountHash.equals(undefined)).toBe(false);
      expect(accountHash.equals('')).toBe(false);
      expect(accountHash.equals('123')).toBe(false);
      expect(accountHash.equals('abcd')).toBe(false);
      expect(accountHash.equals(123)).toBe(false);
      expect(accountHash.equals(0)).toBe(false);
      expect(accountHash.equals(-12)).toBe(false);
      expect(accountHash.equals(0.3)).toBe(false);
      expect(accountHash.equals(false)).toBe(false);
      expect(accountHash.equals(true)).toBe(false);
      expect(accountHash.equals(Symbol('p'))).toBe(false);
      expect(accountHash.equals(20n)).toBe(false);
      expect(accountHash.equals({})).toBe(false);
      expect(accountHash.equals([])).toBe(false);
      expect(accountHash.equals(Object.create(null))).toBe(false);
    });

    it('returns true if all the properties are the same', () => {
      expect.assertions(5);

      const account1: MockVeauAccountID = new MockVeauAccountID();
      const account2: MockVeauAccountID = new MockVeauAccountID();
      const hash1: Hash = Hash.of('hash 1');
      const hash2: Hash = Hash.of('hash 2');

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
      expect.assertions(1);

      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const hash: string = 'hash';

      const accountHash: AccountHash = AccountHash.of(VeauAccountID.ofString(id), Hash.of(hash));

      expect(accountHash.toString()).toBe(`${id} ${hash}`);
    });
  });
});

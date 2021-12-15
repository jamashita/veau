import { AccountName } from '../AccountName';

describe('AccountName', () => {
  describe('empty', () => {
    it('must be an empty name', () => {
      expect.assertions(1);

      expect(AccountName.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(AccountName.empty()).toBe(AccountName.empty());
    });
  });

  describe('of', () => {
    it('if the name is empty, returns AccountName.empty()', () => {
      expect.assertions(1);

      expect(AccountName.of('')).toBe(AccountName.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const name1: string = 'account name 1';
      const name2: string = 'account name 2';
      const name3: string = 'account name 3';

      expect(AccountName.of(name1).get()).toBe(name1);
      expect(AccountName.of(name2).get()).toBe(name2);
      expect(AccountName.of(name3).get()).toBe(name3);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const name: AccountName = AccountName.of('account name');

      expect(name.equals(null)).toBe(false);
      expect(name.equals(undefined)).toBe(false);
      expect(name.equals('')).toBe(false);
      expect(name.equals('123')).toBe(false);
      expect(name.equals('abcd')).toBe(false);
      expect(name.equals(123)).toBe(false);
      expect(name.equals(0)).toBe(false);
      expect(name.equals(-12)).toBe(false);
      expect(name.equals(0.3)).toBe(false);
      expect(name.equals(false)).toBe(false);
      expect(name.equals(true)).toBe(false);
      expect(name.equals(Symbol('p'))).toBe(false);
      expect(name.equals(20n)).toBe(false);
      expect(name.equals({})).toBe(false);
      expect(name.equals([])).toBe(false);
      expect(name.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const name1: AccountName = AccountName.of('account name 1');
      const name2: AccountName = AccountName.of('account name 2');
      const name3: AccountName = AccountName.of('account name 1');

      expect(name1.equals(name1)).toBe(true);
      expect(name1.equals(name2)).toBe(false);
      expect(name1.equals(name3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the name is empty string', () => {
      expect.assertions(3);

      const name1: AccountName = AccountName.empty();
      const name2: AccountName = AccountName.of('');
      const name3: AccountName = AccountName.of('p');

      expect(name1.isEmpty()).toBe(true);
      expect(name2.isEmpty()).toBe(true);
      expect(name3.isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const name: string = 'hash';
      const accountName: AccountName = AccountName.of(name);

      expect(accountName.toString()).toBe(name);
    });
  });
});

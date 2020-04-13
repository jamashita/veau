import { AccountName } from '../AccountName';

// DONE
describe('AccountName', () => {
  describe('default', () => {
    it('must be an empty name', () => {
      expect(AccountName.default().get()).toEqual('');
    });

    it('returns singleton instance', () => {
      expect(AccountName.default()).toBe(AccountName.default());
    });
  });

  describe('of', () => {
    it('if the name is empty, returns AccountName.default()', () => {
      expect(AccountName.of('')).toBe(AccountName.default());
    });

    it('normal case', () => {
      const name1: string = 'account name 1';
      const name2: string = 'account name 2';
      const name3: string = 'account name 3';

      expect(AccountName.of(name1).get()).toEqual(name1);
      expect(AccountName.of(name2).get()).toEqual(name2);
      expect(AccountName.of(name3).get()).toEqual(name3);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const name1: AccountName = AccountName.of('account name 1');
      const name2: AccountName = AccountName.of('account name 2');
      const name3: AccountName = AccountName.of('account name 1');

      expect(name1.equals(name1)).toEqual(true);
      expect(name1.equals(name2)).toEqual(false);
      expect(name1.equals(name3)).toEqual(true);
    });
  });

  describe('isDefault', () => {
    it('returns true if the name is empty string', () => {
      const name1: AccountName = AccountName.default();
      const name2: AccountName = AccountName.of('');
      const name3: AccountName = AccountName.of('p');

      expect(name1.isDefault()).toEqual(true);
      expect(name2.isDefault()).toEqual(true);
      expect(name3.isDefault()).toEqual(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const name: string = 'hash';
      const accountName: AccountName = AccountName.of(name);

      expect(accountName.toString()).toEqual(name);
    });
  });
});

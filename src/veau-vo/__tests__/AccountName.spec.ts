import { AccountName } from '../AccountName';

describe('AccountName', () => {
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

  describe('default', () => {
    it('must be an empty name', () => {
      expect(AccountName.default().get()).toEqual('');
    });
  });
});

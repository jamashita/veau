import 'jest';
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
});

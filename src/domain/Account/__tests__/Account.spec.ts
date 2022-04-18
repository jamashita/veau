import { UUID } from '@jamashita/anden-uuid';
import { Password } from '../../EntranceInformation/Password';
import { LanguageID } from '../../Language/LanguageID';
import { RegionID } from '../../Region/RegionID';
import { MockVeauAccount } from '../../VeauAccount/mock/MockVeauAccount';
import { MockVeauAccountID } from '../../VeauAccount/mock/MockVeauAccountID';
import { Account, AccountRow } from '../Account';
import { AccountError } from '../AccountError';
import { Hash } from '../Hash';

describe('Account', () => {
  describe('of', () => {
    it('normal case', () => {
      const acccunt: MockVeauAccount = new MockVeauAccount();
      const hash: Hash = Hash.of('hash');

      const account: Account = Account.of(acccunt, hash);

      expect(account.getVeauAccount()).toBe(acccunt);
      expect(account.getHash()).toBe(hash);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: AccountRow = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'account',
        hash: 'hash'
      };

      const account: Account = Account.ofRow(row);

      expect(account.getVeauAccountID().get().get()).toBe(row.veauAccountID);
      expect(account.getLanguageID().get().get()).toBe(row.languageID);
      expect(account.getRegionID().get().get()).toBe(row.regionID);
      expect(account.getAccountName().get()).toBe(row.name);
      expect(account.getHash().get()).toBe(row.hash);
    });

    it('contains malformat veauAccountID', () => {
      const row: AccountRow = {
        veauAccountID: 'malformat',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'account',
        hash: 'hash'
      };

      expect(() => {
        Account.ofRow(row);
      }).toThrow(AccountError);
    });

    it('contains malformat languageID', () => {
      const row: AccountRow = {
        veauAccountID: UUID.v4().get(),
        languageID: 'malformat',
        regionID: UUID.v4().get(),
        name: 'account',
        hash: 'hash'
      };

      expect(() => {
        Account.ofRow(row);
      }).toThrow(AccountError);
    });

    it('contains malformat regionID', () => {
      const row: AccountRow = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: 'malformat',
        name: 'account',
        hash: 'hash'
      };

      expect(() => {
        Account.ofRow(row);
      }).toThrow(AccountError);
    });
  });

  describe('verify', () => {
    it('returns true if the password is acceptable', async () => {
      const password1: Password = Password.of('password');
      const password2: Password = Password.of('wrong one');
      const account: Account = Account.of(
        new MockVeauAccount(),
        Hash.of('$2b$14$dVujfUAxm6mo8rujdy7jbuoNcMYC4R2Rf.mqzk2/oXhFQgBIWiZUu')
      );

      const [correct1, correct2]: [boolean, boolean] = await Promise.all([
        account.verify(password1),
        account.verify(password2)
      ]);

      expect(correct1).toBe(true);
      expect(correct2).toBe(false);
    }, 30000);
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const account: Account = Account.of(new MockVeauAccount(), Hash.of('hash'));

      expect(account.equals(null)).toBe(false);
      expect(account.equals(undefined)).toBe(false);
      expect(account.equals('')).toBe(false);
      expect(account.equals('123')).toBe(false);
      expect(account.equals('abcd')).toBe(false);
      expect(account.equals(123)).toBe(false);
      expect(account.equals(0)).toBe(false);
      expect(account.equals(-12)).toBe(false);
      expect(account.equals(0.3)).toBe(false);
      expect(account.equals(false)).toBe(false);
      expect(account.equals(true)).toBe(false);
      expect(account.equals(Symbol('p'))).toBe(false);
      expect(account.equals(20n)).toBe(false);
      expect(account.equals({})).toBe(false);
      expect(account.equals([])).toBe(false);
      expect(account.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the all properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const account1: Account = Account.of(
        new MockVeauAccount({
          veauAccountID: new MockVeauAccountID(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid4)
        }),
        Hash.of('hash')
      );
      const account2: Account = Account.of(
        new MockVeauAccount({
          veauAccountID: new MockVeauAccountID(uuid2),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid4)
        }),
        Hash.of('hash')
      );
      const account3: Account = Account.of(
        new MockVeauAccount({
          veauAccountID: new MockVeauAccountID(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid4)
        }),
        Hash.of('hash')
      );

      expect(account1.equals(account1)).toBe(true);
      expect(account1.equals(account2)).toBe(false);
      expect(account1.equals(account3)).toBe(true);
    });
  });
});

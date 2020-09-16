import { UUID } from '@jamashita/publikum-uuid';
import { Password } from '../../EntranceInformation/Password';
import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { MockVeauAccount } from '../../VeauAccount/Mock/MockVeauAccount';
import { MockVeauAccountID } from '../../VeauAccount/Mock/MockVeauAccountID';
import { VeauAccount } from '../../VeauAccount/VeauAccount';
import { VeauAccountID } from '../../VeauAccount/VeauAccountID';
import { Account, AccountRow } from '../Account';
import { AccountName } from '../AccountName';
import { AccountError } from '../Error/AccountError';
import { Hash } from '../Hash';
import { MockHash } from '../Mock/MockHash';

describe('Account', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(2);

      const acccunt: MockVeauAccount = new MockVeauAccount();
      const hash: MockHash = new MockHash();

      const account: Account = Account.of(acccunt, hash);

      expect(account.getVeauAccount()).toBe(acccunt);
      expect(account.getHash()).toBe(hash);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      expect.assertions(5);

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
      expect.assertions(1);

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
      expect.assertions(1);

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
      expect.assertions(1);

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
      expect.assertions(2);

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
    it('returns true if the all properties are the same', () => {
      expect.assertions(3);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const account1: Account = Account.of(
        new MockVeauAccount({
          veauAccountID: new MockVeauAccountID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid4)
        }),
        new MockHash()
      );
      const account2: Account = Account.of(
        new MockVeauAccount({
          veauAccountID: new MockVeauAccountID(uuid2),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid4)
        }),
        new MockHash()
      );
      const account3: Account = Account.of(
        new MockVeauAccount({
          veauAccountID: new MockVeauAccountID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid4)
        }),
        new MockHash()
      );

      expect(account1.equals(account1)).toBe(true);
      expect(account1.equals(account2)).toBe(false);
      expect(account1.equals(account3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const name: string = 'veau';
      const hash: string = 'hash hash hash';
      const account: Account = Account.of(
        VeauAccount.of(
          VeauAccountID.of(uuid1),
          LanguageID.of(uuid2),
          RegionID.of(uuid3),
          AccountName.of(name)
        ),
        Hash.of(hash)
      );

      expect(account.toString()).toBe(`${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${name} ${hash}`);
    });
  });
});

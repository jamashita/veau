import { Superposition, UUID } from 'publikum';
import sinon, { SinonSpy } from 'sinon';
import { AccountError } from '../../Error/AccountError';
import { Account, AccountRow } from '../Account';
import { AccountName } from '../AccountName';
import { Hash } from '../Hash';
import { LanguageID } from '../LanguageID';
import { MockAccountName } from '../Mock/MockAccountName';
import { MockHash } from '../Mock/MockHash';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockVeauAccountID } from '../Mock/MockVeauAccountID';
import { Password } from '../Password';
import { RegionID } from '../RegionID';
import { VeauAccount } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';

describe('Account', () => {
  describe('of', () => {
    it('normal case', () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
      const name: MockAccountName = new MockAccountName();
      const hash: MockHash = new MockHash();

      const account: Account = Account.of(
        accountID,
        languageID,
        regionID,
        name,
        hash
      );

      expect(account.getVeauAccountID()).toBe(accountID);
      expect(account.getLanguageID()).toBe(languageID);
      expect(account.getRegionID()).toBe(regionID);
      expect(account.getAccount()).toBe(name);
      expect(account.getHash()).toBe(hash);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: AccountRow = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        account: 'account',
        hash: 'hash'
      };

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isAlive()).toBe(true);
      const account: Account = superposition.get();
      expect(account.getVeauAccountID().get().get()).toBe(row.veauAccountID);
      expect(account.getLanguageID().get().get()).toBe(row.languageID);
      expect(account.getRegionID().get().get()).toBe(row.regionID);
      expect(account.getAccount().get()).toBe(row.account);
      expect(account.getHash().get()).toBe(row.hash);
    });

    it('contains malformat veauAccountID', () => {
      const row: AccountRow = {
        veauAccountID: 'malformat',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        account: 'account',
        hash: 'hash'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: AccountError) => {
        spy2();
        expect(err).toBeInstanceOf(AccountError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains malformat languageID', () => {
      const row: AccountRow = {
        veauAccountID: UUID.v4().get(),
        languageID: 'malformat',
        regionID: UUID.v4().get(),
        account: 'account',
        hash: 'hash'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: AccountError) => {
        spy2();
        expect(err).toBeInstanceOf(AccountError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains malformat regionID', () => {
      const row: AccountRow = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: 'malformat',
        account: 'account',
        hash: 'hash'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: AccountError) => {
        spy2();
        expect(err).toBeInstanceOf(AccountError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('verify', () => {
    it('returns true if the password is acceptable', async () => {
      const password1: Password = Password.of('password');
      const password2: Password = Password.of('wrong one');
      const account: Account = Account.of(
        new MockVeauAccountID(),
        new MockLanguageID(),
        new MockRegionID(),
        new MockAccountName(),
        Hash.of('$2b$14$dVujfUAxm6mo8rujdy7jbuoNcMYC4R2Rf.mqzk2/oXhFQgBIWiZUu')
      );

      const [
        correct1,
        correct2
      ]: [
        boolean,
        boolean
      ] = await Promise.all([
        account.verify(password1),
        account.verify(password2)
      ]);

      expect(correct1).toBe(true);
      expect(correct2).toBe(false);
    }, 30000);
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const accountID1: MockVeauAccountID = new MockVeauAccountID();
      const accountID2: MockVeauAccountID = new MockVeauAccountID();
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const account1: Account = Account.of(
        accountID1,
        new MockLanguageID(uuid1),
        new MockRegionID(uuid3),
        new MockAccountName(),
        new MockHash()
      );
      const account2: Account = Account.of(
        accountID2,
        new MockLanguageID(uuid1),
        new MockRegionID(uuid3),
        new MockAccountName(),
        new MockHash()
      );
      const account3: Account = Account.of(
        accountID1,
        new MockLanguageID(uuid2),
        new MockRegionID(uuid3),
        new MockAccountName(),
        new MockHash()
      );
      const account4: Account = Account.of(
        accountID1,
        new MockLanguageID(uuid1),
        new MockRegionID(uuid4),
        new MockAccountName(),
        new MockHash()
      );
      const account5: Account = Account.of(
        accountID1,
        new MockLanguageID(uuid1),
        new MockRegionID(uuid3),
        new MockAccountName('rectangle'),
        new MockHash()
      );
      const account6: Account = Account.of(
        accountID1,
        new MockLanguageID(uuid1),
        new MockRegionID(uuid3),
        new MockAccountName(),
        new MockHash('hash hash hash')
      );
      const account7: Account = Account.of(
        accountID1,
        new MockLanguageID(uuid1),
        new MockRegionID(uuid3),
        new MockAccountName(),
        new MockHash()
      );

      expect(account1.equals(account1)).toBe(true);
      expect(account1.equals(account2)).toBe(false);
      expect(account1.equals(account3)).toBe(false);
      expect(account1.equals(account4)).toBe(false);
      expect(account1.equals(account5)).toBe(false);
      expect(account1.equals(account6)).toBe(false);
      expect(account1.equals(account7)).toBe(true);
    });
  });

  describe('toVeauAccount', () => {
    it('normal case', () => {
      const account: Account = Account.of(
        new MockVeauAccountID(),
        new MockLanguageID(),
        new MockRegionID(),
        new MockAccountName(),
        new MockHash()
      );

      const veauAccount: VeauAccount = account.toVeauAccount();

      expect(veauAccount.getVeauAccountID()).toBe(account.getVeauAccountID());
      expect(veauAccount.getLanguageID()).toBe(account.getLanguageID());
      expect(veauAccount.getRegionID()).toBe(account.getRegionID());
      expect(veauAccount.getAccount()).toBe(account.getAccount());
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const name: string = 'veau';
      const hash: string = 'hash hash hash';
      const account: Account = Account.of(
        VeauAccountID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        AccountName.of(name),
        Hash.of(hash)
      );

      expect(account.toString()).toBe(`${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${name} ${hash}`);
    });
  });
});

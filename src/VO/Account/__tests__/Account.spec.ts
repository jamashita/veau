import { Superposition, UUID } from 'publikum';
import sinon, { SinonSpy } from 'sinon';

import { AccountError } from '../Error/AccountError';
import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockHash } from '../Mock/MockHash';
import { MockVeauAccount } from '../../VeauAccount/Mock/MockVeauAccount';
import { MockVeauAccountID } from '../../VeauAccount/Mock/MockVeauAccountID';
import { Password } from '../../EntranceInformation/Password';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { VeauAccount } from '../../VeauAccount/VeauAccount';
import { VeauAccountID } from '../../VeauAccount/VeauAccountID';
import { Account, AccountRow } from '../Account';
import { AccountName } from '../AccountName';
import { Hash } from '../Hash';

describe('Account', () => {
  describe('of', () => {
    it('normal case', () => {
      const acccunt: MockVeauAccount = new MockVeauAccount();
      const hash: MockHash = new MockHash();

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

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isAlive()).toBe(true);
      const account: Account = superposition.get();
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: AccountError) => {
          spy2();
          expect(err).toBeInstanceOf(AccountError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains malformat languageID', () => {
      const row: AccountRow = {
        veauAccountID: UUID.v4().get(),
        languageID: 'malformat',
        regionID: UUID.v4().get(),
        name: 'account',
        hash: 'hash'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: AccountError) => {
          spy2();
          expect(err).toBeInstanceOf(AccountError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains malformat regionID', () => {
      const row: AccountRow = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: 'malformat',
        name: 'account',
        hash: 'hash'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: AccountError) => {
          spy2();
          expect(err).toBeInstanceOf(AccountError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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
    it('returns true if the all properties are the same', () => {
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
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const name: string = 'veau';
      const hash: string = 'hash hash hash';
      const account: Account = Account.of(
        VeauAccount.of(VeauAccountID.of(uuid1), LanguageID.of(uuid2), RegionID.of(uuid3), AccountName.of(name)),
        Hash.of(hash)
      );

      expect(account.toString()).toBe(`${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${name} ${hash}`);
    });
  });
});
import { Superposition } from 'publikum';
import sinon, { SinonSpy } from 'sinon';
import { AccountError } from '../../Error/AccountError';
import { Account, AccountRow } from '../Account';
import { AccountName } from '../AccountName';
import { Hash } from '../Hash';
import { Language } from '../Language';
import { MockAccountName } from '../Mock/MockAccountName';
import { MockHash } from '../Mock/MockHash';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockVeauAccountID } from '../Mock/MockVeauAccountID';
import { Password } from '../Password';
import { Region } from '../Region';
import { VeauAccount } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';

describe('Account', () => {
  describe('of', () => {
    it('normal case', () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const name: MockAccountName = new MockAccountName();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const hash: MockHash = new MockHash();

      const account: Account = Account.of(
        accountID,
        name,
        language,
        region,
        hash
      );

      expect(account.getVeauAccountID()).toBe(accountID);
      expect(account.getAccount()).toBe(name);
      expect(account.getLanguage()).toBe(language);
      expect(account.getRegion()).toBe(region);
      expect(account.getHash()).toBe(hash);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: AccountRow = {
        veauAccountID: '998106de-b2e7-4981-9643-22cd30cd74de',
        account: 'account',
        languageID: 1,
        languageName: 'аҧсуа бызшәа',
        languageEnglishName: 'Abkhazian',
        iso639: 'ab',
        regionID: 1,
        regionName: 'Afghanistan',
        iso3166: 'AFG',
        hash: 'hash'
      };

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isSuccess()).toBe(true);
      const account: Account = superposition.get();
      expect(account.getVeauAccountID().get().get()).toBe(row.veauAccountID);
      expect(account.getAccount().get()).toBe(row.account);
      expect(account.getLanguage().getLanguageID().get()).toBe(row.languageID);
      expect(account.getLanguage().getName().get()).toBe(row.languageName);
      expect(account.getLanguage().getEnglishName().get()).toBe(row.languageEnglishName);
      expect(account.getLanguage().getISO639().get()).toBe(row.iso639);
      expect(account.getRegion().getRegionID().get()).toBe(row.regionID);
      expect(account.getRegion().getName().get()).toBe(row.regionName);
      expect(account.getRegion().getISO3166().get()).toBe(row.iso3166);
      expect(account.getHash().get()).toBe(row.hash);
    });

    it('contains malformat veauAccountID', () => {
      const row: AccountRow = {
        veauAccountID: 'malformat',
        account: 'account',
        languageID: 1,
        languageName: 'аҧсуа бызшәа',
        languageEnglishName: 'Abkhazian',
        iso639: 'ab',
        regionID: 1,
        regionName: 'Afghanistan',
        iso3166: 'AFG',
        hash: 'hash'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Account, AccountError> = Account.ofRow(row);

      expect(superposition.isFailure()).toBe(true);
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
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion(),
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
      const account1: Account = Account.of(
        accountID1,
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion(),
        new MockHash()
      );
      const account2: Account = Account.of(
        accountID2,
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion(),
        new MockHash()
      );
      const account3: Account = Account.of(
        accountID1,
        new MockAccountName('rectangle'),
        new MockLanguage(),
        new MockRegion(),
        new MockHash()
      );
      const account4: Account = Account.of(
        accountID1,
        new MockAccountName(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion(),
        new MockHash()
      );
      const account5: Account = Account.of(
        accountID1,
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion({
          regionID: new MockRegionID(2)
        }),
        new MockHash()
      );
      const account6: Account = Account.of(
        accountID1,
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion(),
        new MockHash('hash hash hash')
      );
      const account7: Account = Account.of(
        accountID1,
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion(),
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
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion(),
        new MockHash()
      );

      const veauAccount: VeauAccount = account.toVeauAccount();

      expect(veauAccount.getVeauAccountID()).toBe(account.getVeauAccountID());
      expect(veauAccount.getAccount()).toBe(account.getAccount());
      expect(veauAccount.getLanguage()).toBe(account.getLanguage());
      expect(veauAccount.getRegion()).toBe(account.getRegion());
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const name: string = 'veau';
      const language: Language = Language.empty();
      const region: Region = Region.empty();
      const hash: string = 'hash hash hash';
      const account: Account = Account.of(
        VeauAccountID.ofString(id).get(),
        AccountName.of(name),
        language,
        region,
        Hash.of(hash)
      );

      expect(account.toString()).toBe(`${id} ${name} ${language.toString()} ${region.toString()} ${hash}`);
    });
  });
});

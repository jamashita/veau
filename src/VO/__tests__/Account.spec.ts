import sinon, { SinonSpy } from 'sinon';
import { AccountError } from '../../Error/AccountError';
import { Try } from '../../General/Try/Try';
import { Account, AccountRow } from '../Account';
import { AccountName } from '../AccountName';
import { Hash } from '../Hash';
import { Language } from '../Language';
import { Password } from '../Password';
import { Region } from '../Region';
import { VeauAccount } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';
import { MockVeauAccountID } from '../Mock/MockVeauAccountID';
import { MockAccountName } from '../Mock/MockAccountName';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockRegion } from '../Mock/MockRegion';
import { MockHash } from '../Mock/MockHash';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockRegionID } from '../Mock/MockRegionID';

// DONE
describe('Account', () => {
  describe('of', () => {
    it('normal case', () => {
      const accountID: MockVeauAccountID = new MockVeauAccountID();
      const name: MockAccountName = new MockAccountName();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion()
      const hash: MockHash = new MockHash();

      const account: Account = Account.of(
        accountID,
        name,
        language,
        region,
        hash
      );

      expect(account.getVeauAccountID()).toEqual(accountID);
      expect(account.getAccount()).toEqual(name);
      expect(account.getLanguage()).toEqual(language);
      expect(account.getRegion()).toEqual(region);
      expect(account.getHash()).toEqual(hash);
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

      const trial: Try<Account, AccountError> = Account.ofRow(row);

      expect(trial.isSuccess()).toEqual(true);
      const account: Account = trial.get();
      expect(account.getVeauAccountID().get().get()).toEqual(row.veauAccountID);
      expect(account.getAccount().get()).toEqual(row.account);
      expect(account.getLanguage().getLanguageID().get()).toEqual(row.languageID);
      expect(account.getLanguage().getName().get()).toEqual(row.languageName);
      expect(account.getLanguage().getEnglishName().get()).toEqual(row.languageEnglishName);
      expect(account.getLanguage().getISO639().get()).toEqual(row.iso639);
      expect(account.getRegion().getRegionID().get()).toEqual(row.regionID);
      expect(account.getRegion().getName().get()).toEqual(row.regionName);
      expect(account.getRegion().getISO3166().get()).toEqual(row.iso3166);
      expect(account.getHash().get()).toEqual(row.hash);
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

      const trial: Try<Account, AccountError> = Account.ofRow(row);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: AccountError) => {
        spy2();
        expect(err).toBeInstanceOf(AccountError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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

      const correct1: boolean = await account.verify(password1);
      const correct2: boolean = await account.verify(password2);

      expect(correct1).toEqual(true);
      expect(correct2).toEqual(false);
    });
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

      expect(account1.equals(account1)).toEqual(true);
      expect(account1.equals(account2)).toEqual(false);
      expect(account1.equals(account3)).toEqual(false);
      expect(account1.equals(account4)).toEqual(false);
      expect(account1.equals(account5)).toEqual(false);
      expect(account1.equals(account6)).toEqual(false);
      expect(account1.equals(account7)).toEqual(true);
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

      expect(veauAccount.getVeauAccountID()).toEqual(account.getVeauAccountID());
      expect(veauAccount.getAccount()).toEqual(account.getAccount());
      expect(veauAccount.getLanguage()).toEqual(account.getLanguage());
      expect(veauAccount.getRegion()).toEqual(account.getRegion());
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const name: string = 'veau';
      const h: string = 'hash';
      const language: Language = Language.empty();
      const region: Region = Region.default();
      const hash: Hash = Hash.of(h);
      const account: Account = Account.of(VeauAccountID.ofString(id).get(), AccountName.of(name), language, region, hash);

      expect(account.toString()).toEqual(`${id} ${name} ${language.toString()} ${region.toString()} ${h}`);
    });
  });
});

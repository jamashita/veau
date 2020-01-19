import 'jest';
import { Account, AccountRow } from '../Account';
import { AccountName } from '../AccountName';
import { Hash } from '../Hash';
import { ISO3166 } from '../ISO3166';
import { ISO639 } from '../ISO639';
import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Region } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { VeauAccount } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';

describe('Account', () => {
  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const account1: Account = Account.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')), Hash.of('hash 1'));
      const account2: Account = Account.of(VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')), Hash.of('hash 1'));
      const account3: Account = Account.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('rectangle'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')), Hash.of('hash 1'));
      const account4: Account = Account.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')), Hash.of('hash 1'));
      const account5: Account = Account.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB')), Hash.of('hash 1'));
      const account6: Account = Account.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')), Hash.of('hash 2'));
      const account7: Account = Account.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')), Hash.of('hash 1'));

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
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const hash: Hash = Hash.of('hash');
      const account: Account = Account.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), language, region, hash);
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
      const language: Language = Language.default();
      const region: Region = Region.default();
      const hash: Hash = Hash.of(h);
      const account: Account = Account.of(VeauAccountID.of(id), AccountName.of(name), language, region, hash);

      expect(account.toString()).toEqual(`${id} ${name} ${language.toString()} ${region.toString()} ${h}`);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const accountID: VeauAccountID = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');
      const name: AccountName = AccountName.of('account');
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const hash: Hash = Hash.of('hash');

      const account: Account = Account.of(accountID, name, language, region, hash);

      expect(account.getVeauAccountID().equals(accountID)).toEqual(true);
      expect(account.getAccount().equals(name)).toEqual(true);
      expect(account.getLanguage().equals(language)).toEqual(true);
      expect(account.getRegion().equals(region)).toEqual(true);
      expect(account.getHash().equals(hash)).toEqual(true);
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

      const account: Account = Account.ofRow(row);

      expect(account.getVeauAccountID().get()).toEqual(row.veauAccountID);
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
  });
});

import 'jest';
import { UUID } from '../../veau-general/UUID';
import { AccountName } from '../AccountName';
import { ISO3166 } from '../ISO3166';
import { ISO639 } from '../ISO639';
import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Region } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { VeauAccount, VeauAccountJSON } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccount', () => {
  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const veauAccount1: VeauAccount = VeauAccount.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')));
      const veauAccount2: VeauAccount = VeauAccount.of(VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')));
      const veauAccount3: VeauAccount = VeauAccount.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('rectangle'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')));
      const veauAccount4: VeauAccount = VeauAccount.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')));
      const veauAccount5: VeauAccount = VeauAccount.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB')));
      const veauAccount6: VeauAccount = VeauAccount.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')));

      expect(veauAccount1.equals(veauAccount1)).toEqual(true);
      expect(veauAccount1.equals(veauAccount2)).toEqual(false);
      expect(veauAccount1.equals(veauAccount3)).toEqual(false);
      expect(veauAccount1.equals(veauAccount4)).toEqual(false);
      expect(veauAccount1.equals(veauAccount5)).toEqual(false);
      expect(veauAccount1.equals(veauAccount6)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const veauAccount: VeauAccount = VeauAccount.of(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), AccountName.of('veau'), language, region);

      expect(veauAccount.toJSON()).toEqual({
        veauAccountID: '998106de-b2e7-4981-9643-22cd30cd74de',
        account: 'veau',
        language: {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        region: {
          regionID: 1,
          name: 'Afghanistan',
          iso3166: 'AFG'
        }
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const name: string = 'veau';
      const language: Language = Language.default();
      const region: Region = Region.default();
      const veauAccount: VeauAccount = VeauAccount.of(VeauAccountID.of(id), AccountName.of(name), language, region);

      expect(veauAccount.toString()).toEqual(`${id} ${name} ${language.toString()} ${region.toString()}`);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const veauAccountID: VeauAccountID = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');
      const account: AccountName = AccountName.of('account');
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));

      const veauAccount: VeauAccount = VeauAccount.of(veauAccountID, account, language, region);

      expect(veauAccount.getVeauAccountID().equals(veauAccountID)).toEqual(true);
      expect(veauAccount.getAccount()).toEqual(account);
      expect(veauAccount.getLanguage().equals(language)).toEqual(true);
      expect(veauAccount.getRegion().equals(region)).toEqual(true);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: VeauAccountJSON = {
        veauAccountID: '998106de-b2e7-4981-9643-22cd30cd74de',
        account: 'account',
        language: {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        region: {
          regionID: 1,
          name: 'Afghanistan',
          iso3166: 'AFG'
        }
      };

      const veauAccount: VeauAccount = VeauAccount.ofJSON(json);

      expect(veauAccount.getVeauAccountID().get()).toEqual(json.veauAccountID);
      expect(veauAccount.getAccount().get()).toEqual(json.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(veauAccount.getLanguage().getName().get()).toEqual(json.language.name);
      expect(veauAccount.getLanguage().getEnglishName().get()).toEqual(json.language.englishName);
      expect(veauAccount.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(veauAccount.getRegion().getName().get()).toEqual(json.region.name);
      expect(veauAccount.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
    });
  });

  describe('default', () => {
    it('has randomly generated id and empty name, language, and region', () => {
      const account: VeauAccount = VeauAccount.default();
      expect(account.getVeauAccountID().get().length).toEqual(UUID.size());
      expect(account.getAccount().get()).toEqual('');
      expect(account.getRegion().getRegionID().get()).toEqual(0);
      expect(account.getLanguage().getLanguageID().get()).toEqual(0);
    });
  });
});

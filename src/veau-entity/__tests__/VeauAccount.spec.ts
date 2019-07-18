import 'jest';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { RegionID } from '../../veau-vo/RegionID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { Language } from '../Language';
import { Region } from '../Region';
import { VeauAccount, VeauAccountJSON, VeauAccountRow } from '../VeauAccount';

describe('VeauAccount', () => {
  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const veauAccount1: VeauAccount = VeauAccount.from(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), 'veau', Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.from(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG')));
      const veauAccount2: VeauAccount = VeauAccount.from(VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9'), 'veau', Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.from(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG')));
      const veauAccount3: VeauAccount = VeauAccount.from(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), 'veau', Language.from(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa')), Region.from(RegionID.of(2), 'Albania', ISO3166.of('ALB')));

      expect(veauAccount1.equals(veauAccount1)).toEqual(true);
      expect(veauAccount1.equals(veauAccount2)).toEqual(false);
      expect(veauAccount1.equals(veauAccount3)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
      const veauAccount: VeauAccount = VeauAccount.from(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), 'veau', language, region);

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

  describe('copy', () => {
    it('every properties are copied', () => {
      const veauAccountID: VeauAccountID = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');
      const account: string = 'veau';
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
      const veauAccount: VeauAccount = VeauAccount.from(veauAccountID, account, language, region);
      const copy: VeauAccount = veauAccount.copy();

      expect(veauAccount).not.toBe(copy);
      expect(copy.getVeauAccountID()).toEqual(veauAccountID);
      expect(copy.getAccount()).toEqual(account);
      expect(copy.getLanguage()).toEqual(language);
      expect(copy.getRegion()).toEqual(region);
    });
  });

  describe('from', () => {
    it('normal case', () => {
      const veauAccountID: VeauAccountID = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');
      const account: string = 'account';
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));

      const veauAccount: VeauAccount = VeauAccount.from(veauAccountID, account, language, region);

      expect(veauAccount.getVeauAccountID().equals(veauAccountID)).toEqual(true);
      expect(veauAccount.getAccount()).toEqual(account);
      expect(veauAccount.getLanguage().equals(language)).toEqual(true);
      expect(veauAccount.getRegion().equals(region)).toEqual(true);
    });
  });

  describe('fromJSON', () => {
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

      const veauAccount: VeauAccount = VeauAccount.fromJSON(json);

      expect(veauAccount.getVeauAccountID().get()).toEqual(json.veauAccountID);
      expect(veauAccount.getAccount()).toEqual(json.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(veauAccount.getLanguage().getName().get()).toEqual(json.language.name);
      expect(veauAccount.getLanguage().getEnglishName().get()).toEqual(json.language.englishName);
      expect(veauAccount.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(veauAccount.getRegion().getName()).toEqual(json.region.name);
      expect(veauAccount.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const row: VeauAccountRow = {
        veauAccountID: '998106de-b2e7-4981-9643-22cd30cd74de',
        account: 'account',
        languageID: 1,
        languageName: 'аҧсуа бызшәа',
        languageEnglishName: 'Abkhazian',
        iso639: 'ab',
        regionID: 1,
        regionName: 'Afghanistan',
        iso3166: 'AFG',
        hash: ''
      };

      const veauAccount: VeauAccount = VeauAccount.fromRow(row);

      expect(veauAccount.getVeauAccountID().get()).toEqual(row.veauAccountID);
      expect(veauAccount.getAccount()).toEqual(row.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(row.languageID);
      expect(veauAccount.getLanguage().getName().get()).toEqual(row.languageName);
      expect(veauAccount.getLanguage().getEnglishName().get()).toEqual(row.languageEnglishName);
      expect(veauAccount.getLanguage().getISO639().get()).toEqual(row.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(row.regionID);
      expect(veauAccount.getRegion().getName()).toEqual(row.regionName);
      expect(veauAccount.getRegion().getISO3166().get()).toEqual(row.iso3166);
    });
  });
});

import 'jest';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { VeauAccount, VeauAccountJSON, VeauAccountRow } from '../../veau-entity/VeauAccount';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { UUID } from '../../veau-vo/UUID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { VeauAccountFactory } from '../VeauAccountFactory';

describe('VeauAccountFactory', () => {
  describe('from', () => {
    it('normal case', () => {
      const veauAccountID: VeauAccountID = VeauAccountID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de'));
      const account: string = 'account';
      const language: Language = new Language(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
      const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));

      const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
      const veauAccount: VeauAccount = veauAccountFactory.from(veauAccountID, account, language, region);

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

      const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
      const veauAccount: VeauAccount = veauAccountFactory.fromJSON(json);

      expect(veauAccount.getVeauAccountID().get().get()).toEqual(json.veauAccountID);
      expect(veauAccount.getAccount()).toEqual(json.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(veauAccount.getLanguage().getName()).toEqual(json.language.name);
      expect(veauAccount.getLanguage().getEnglishName()).toEqual(json.language.englishName);
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

      const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
      const veauAccount: VeauAccount = veauAccountFactory.fromRow(row);

      expect(veauAccount.getVeauAccountID().get().get()).toEqual(row.veauAccountID);
      expect(veauAccount.getAccount()).toEqual(row.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(row.languageID);
      expect(veauAccount.getLanguage().getName()).toEqual(row.languageName);
      expect(veauAccount.getLanguage().getEnglishName()).toEqual(row.languageEnglishName);
      expect(veauAccount.getLanguage().getISO639().get()).toEqual(row.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(row.regionID);
      expect(veauAccount.getRegion().getName()).toEqual(row.regionName);
      expect(veauAccount.getRegion().getISO3166().get()).toEqual(row.iso3166);
    });
  });
});

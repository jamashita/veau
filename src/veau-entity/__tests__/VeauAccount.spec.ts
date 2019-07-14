import 'jest';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { Language } from '../Language';
import { Region } from '../Region';
import { VeauAccount } from '../VeauAccount';

describe('VeauAccount', () => {
  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const veauAccount1: VeauAccount = new VeauAccount(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), 'veau', Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab')), new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG')));
      const veauAccount2: VeauAccount = new VeauAccount(VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9'), 'veau', Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab')), new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG')));
      const veauAccount3: VeauAccount = new VeauAccount(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), 'veau', Language.from(LanguageID.of(2), 'Afaraf', 'Afar', ISO639.of('aa')), new Region(RegionID.of(2), 'Albania', ISO3166.of('ALB')));

      expect(veauAccount1.equals(veauAccount1)).toEqual(true);
      expect(veauAccount1.equals(veauAccount2)).toEqual(false);
      expect(veauAccount1.equals(veauAccount3)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language: Language = Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
      const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
      const veauAccount: VeauAccount = new VeauAccount(VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de'), 'veau', language, region);

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
      const language: Language = Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
      const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
      const veauAccount: VeauAccount = new VeauAccount(veauAccountID, account, language, region);
      const copy: VeauAccount = veauAccount.copy();

      expect(veauAccount).not.toBe(copy);
      expect(copy.getVeauAccountID()).toEqual(veauAccountID);
      expect(copy.getAccount()).toEqual(account);
      expect(copy.getLanguage()).toEqual(language);
      expect(copy.getRegion()).toEqual(region);
    });
  });
});

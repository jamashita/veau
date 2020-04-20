import sinon, { SinonSpy } from 'sinon';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { Superposition } from '../../General/Superposition/Superposition';
import { UUID } from '../../General/UUID/UUID';
import { AccountName } from '../AccountName';
import { ISO3166 } from '../ISO3166';
import { ISO639 } from '../ISO639';
import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { MockAccountName } from '../Mock/MockAccountName';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockVeauAccountID } from '../Mock/MockVeauAccountID';
import { Region } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { VeauAccount, VeauAccountJSON } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccount', () => {
  describe('of', () => {
    it('normal case', () => {
      const veauAccountID: VeauAccountID = new MockVeauAccountID();
      const account: AccountName = new MockAccountName();
      const language: Language = new MockLanguage();
      const region: Region = new MockRegion();

      const veauAccount: VeauAccount = VeauAccount.of(
        veauAccountID,
        account,
        language,
        region
      );

      expect(veauAccount.getVeauAccountID()).toBe(veauAccountID);
      expect(veauAccount.getAccount()).toBe(account);
      expect(veauAccount.getLanguage()).toBe(language);
      expect(veauAccount.getRegion()).toBe(region);
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

      const superposition: Superposition<VeauAccount, VeauAccountError> = VeauAccount.ofJSON(json);

      expect(superposition.isSuccess()).toBe(true);
      const veauAccount: VeauAccount = superposition.get();
      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getAccount().get()).toBe(json.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toBe(json.language.languageID);
      expect(veauAccount.getLanguage().getName().get()).toBe(json.language.name);
      expect(veauAccount.getLanguage().getEnglishName().get()).toBe(json.language.englishName);
      expect(veauAccount.getLanguage().getISO639().get()).toBe(json.language.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toBe(json.region.regionID);
      expect(veauAccount.getRegion().getName().get()).toBe(json.region.name);
      expect(veauAccount.getRegion().getISO3166().get()).toBe(json.region.iso3166);
    });

    it('veauAccountID is malformat', () => {
      const json: VeauAccountJSON = {
        veauAccountID: 'illegal one',
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<VeauAccount, VeauAccountError> = VeauAccount.ofJSON(json);

      superposition.match<void>(() => {
        spy1();
      }, (err: VeauAccountError) => {
        spy2();
        expect(err).toBeInstanceOf(VeauAccountError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('empty', () => {
    it('has randomly generated id and empty name, language, and region', () => {
      const account1: VeauAccount = VeauAccount.empty();
      const account2: VeauAccount = VeauAccount.empty();

      expect(account1.getVeauAccountID().get().get().length).toBe(UUID.size());
      expect(account1.getVeauAccountID().equals(account2.getVeauAccountID())).toBe(false);
      expect(account1.getAccount()).toBe(AccountName.empty());
      expect(account1.getRegion()).toBe(Region.empty());
      expect(account1.getLanguage()).toBe(Language.empty());
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();

      const veauAccount1: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid1),
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion()
      );
      const veauAccount2: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid2),
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion()
      );
      const veauAccount3: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid1),
        new MockAccountName('rectangle'),
        new MockLanguage(),
        new MockRegion()
      );
      const veauAccount4: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(),
        new MockAccountName(),
        new MockLanguage({
          languageID: new MockLanguageID(3)
        }),
        new MockRegion()
      );
      const veauAccount5: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(),
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion({
          regionID: new MockRegionID(3)
        })
      );
      const veauAccount6: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid1),
        new MockAccountName(),
        new MockLanguage(),
        new MockRegion()
      );

      expect(veauAccount1.equals(veauAccount1)).toBe(true);
      expect(veauAccount1.equals(veauAccount2)).toBe(false);
      expect(veauAccount1.equals(veauAccount3)).toBe(false);
      expect(veauAccount1.equals(veauAccount4)).toBe(false);
      expect(veauAccount1.equals(veauAccount5)).toBe(false);
      expect(veauAccount1.equals(veauAccount6)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language: Language = Language.of(
        LanguageID.of(1),
        LanguageName.of('аҧсуа бызшәа'),
        LanguageName.of('Abkhazian'),
        ISO639.of('ab')
      );
      const region: Region = Region.of(
        RegionID.of(1),
        RegionName.of('Afghanistan'),
        ISO3166.of('AFG')
      );
      const veauAccount: VeauAccount = VeauAccount.of(
        VeauAccountID.ofString('998106de-b2e7-4981-9643-22cd30cd74de').get(),
        AccountName.of('veau'),
        language,
        region
      );

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
      const language: Language = Language.empty();
      const region: Region = Region.empty();
      const veauAccount: VeauAccount = VeauAccount.of(
        VeauAccountID.ofString(id).get(),
        AccountName.of(name),
        language,
        region
      );

      expect(veauAccount.toString()).toBe(`${id} ${name} ${language.toString()} ${region.toString()}`);
    });
  });
});

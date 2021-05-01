import { UUID } from '@jamashita/anden-uuid';
import { AccountName } from '../../Account/AccountName';
import { ISO639 } from '../../Language/ISO639';
import { Language } from '../../Language/Language';
import { LanguageID } from '../../Language/LanguageID';
import { LanguageName } from '../../Language/LanguageName';
import { MockLanguage } from '../../Language/Mock/MockLanguage';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { ISO3166 } from '../../Region/ISO3166';
import { MockRegion } from '../../Region/Mock/MockRegion';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { Region } from '../../Region/Region';
import { RegionID } from '../../Region/RegionID';
import { RegionName } from '../../Region/RegionName';
import { MockVeauAccountID } from '../../VeauAccount/Mock/MockVeauAccountID';
import { VeauAccountID } from '../../VeauAccount/VeauAccountID';
import { Identity } from '../Identity';

describe('Identity', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(4);

      const veauAccountID: VeauAccountID = new MockVeauAccountID();
      const language: Language = new MockLanguage();
      const region: Region = new MockRegion();
      const name: AccountName = AccountName.empty();

      const identity: Identity = Identity.of(veauAccountID, name, language, region);

      expect(identity.getVeauAccountID()).toBe(veauAccountID);
      expect(identity.getAccountName()).toBe(name);
      expect(identity.getLanguage()).toBe(language);
      expect(identity.getRegion()).toBe(region);
    });
  });

  describe('empty', () => {
    it('has randomly generated id and empty name, language, and region', () => {
      expect.assertions(5);

      const identity1: Identity = Identity.empty();
      const identity2: Identity = Identity.empty();

      expect(identity1.getVeauAccountID().get().get()).toHaveLength(UUID.size());
      expect(identity1.getVeauAccountID().equals(identity2.getVeauAccountID())).toBe(false);
      expect(identity1.getRegion()).toBe(Region.empty());
      expect(identity1.getLanguage()).toBe(Language.empty());
      expect(identity1.getAccountName()).toBe(AccountName.empty());
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const identity: Identity = Identity.empty();

      expect(identity.equals(null)).toBe(false);
      expect(identity.equals(undefined)).toBe(false);
      expect(identity.equals('')).toBe(false);
      expect(identity.equals('123')).toBe(false);
      expect(identity.equals('abcd')).toBe(false);
      expect(identity.equals(123)).toBe(false);
      expect(identity.equals(0)).toBe(false);
      expect(identity.equals(-12)).toBe(false);
      expect(identity.equals(0.3)).toBe(false);
      expect(identity.equals(false)).toBe(false);
      expect(identity.equals(true)).toBe(false);
      expect(identity.equals(Symbol('p'))).toBe(false);
      expect(identity.equals(20n)).toBe(false);
      expect(identity.equals({})).toBe(false);
      expect(identity.equals([])).toBe(false);
      expect(identity.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the all properties are the same', () => {
      expect.assertions(6);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();

      const veauAccount1: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        AccountName.empty(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );
      const veauAccount2: Identity = Identity.of(
        new MockVeauAccountID(uuid2),
        AccountName.empty(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );
      const veauAccount3: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        AccountName.empty(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );
      const veauAccount4: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        AccountName.empty(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid6)
        })
      );
      const veauAccount5: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        AccountName.of('rectangle'),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );
      const veauAccount6: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        AccountName.empty(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );

      expect(veauAccount1.equals(veauAccount1)).toBe(true);
      expect(veauAccount1.equals(veauAccount2)).toBe(false);
      expect(veauAccount1.equals(veauAccount3)).toBe(false);
      expect(veauAccount1.equals(veauAccount4)).toBe(false);
      expect(veauAccount1.equals(veauAccount5)).toBe(false);
      expect(veauAccount1.equals(veauAccount6)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const name: string = 'veau account';

      const identity: Identity = Identity.of(
        VeauAccountID.of(uuid1),
        AccountName.of(name),
        Language.of(
          LanguageID.of(uuid2),
          LanguageName.of('e'),
          LanguageName.of('l'),
          ISO639.of('DU')
        ),
        Region.of(
          RegionID.of(uuid3),
          RegionName.of('r'),
          ISO3166.of('IU2')
        )
      );

      expect(identity.toString()).toBe(`${uuid1.get()} ${name} ${uuid2.get()} e l DU ${uuid3.get()} r IU2`);
    });
  });
});

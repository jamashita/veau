import { UUID } from '@jamashita/anden-uuid';
import { AccountName } from '../../Account/AccountName';
import { Language } from '../../Language/Language';
import { LanguageID } from '../../Language/LanguageID';
import { MockLanguage } from '../../Language/mock/MockLanguage';
import { MockRegion } from '../../Region/mock/MockRegion';
import { Region } from '../../Region/Region';
import { RegionID } from '../../Region/RegionID';
import { VeauAccountID } from '../../VeauAccount/VeauAccountID';
import { Identity } from '../Identity';

describe('Identity', () => {
  describe('of', () => {
    it('normal case', () => {
      const veauAccountID: VeauAccountID = VeauAccountID.ofString('5ef8bce9-8e26-4c38-8353-dc05621267a1');
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
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();

      const veauAccount1: Identity = Identity.of(
        VeauAccountID.of(uuid1),
        AccountName.empty(),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        })
      );
      const veauAccount2: Identity = Identity.of(
        VeauAccountID.of(uuid2),
        AccountName.empty(),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        })
      );
      const veauAccount3: Identity = Identity.of(
        VeauAccountID.of(uuid1),
        AccountName.empty(),
        new MockLanguage({
          languageID: LanguageID.of(uuid4)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        })
      );
      const veauAccount4: Identity = Identity.of(
        VeauAccountID.of(uuid1),
        AccountName.empty(),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid6)
        })
      );
      const veauAccount5: Identity = Identity.of(
        VeauAccountID.of(uuid1),
        AccountName.of('rectangle'),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        })
      );
      const veauAccount6: Identity = Identity.of(
        VeauAccountID.of(uuid1),
        AccountName.empty(),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
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
});

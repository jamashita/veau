import { UUID } from 'publikum';
import { AccountName } from '../AccountName';
import { Identity } from '../Identity';
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
import { VeauAccountID } from '../VeauAccountID';

describe('Identity', () => {
  describe('of', () => {
    it('normal case', () => {
      const veauAccountID: VeauAccountID = new MockVeauAccountID();
      const language: Language = new MockLanguage();
      const region: Region = new MockRegion();
      const name: AccountName = new MockAccountName();

      const identity: Identity = Identity.of(
        veauAccountID,
        name,
        language,
        region
      );

      expect(identity.getVeauAccountID()).toBe(veauAccountID);
      expect(identity.getAccount()).toBe(name);
      expect(identity.getLanguage()).toBe(language);
      expect(identity.getRegion()).toBe(region);
    });
  });

  describe('empty', () => {
    it('has randomly generated id and empty name, language, and region', () => {
      const identity1: Identity = Identity.empty();
      const identity2: Identity = Identity.empty();

      expect(identity1.getVeauAccountID().get().get().length).toBe(UUID.size());
      expect(identity1.getVeauAccountID().equals(identity2.getVeauAccountID())).toBe(false);
      expect(identity1.getRegion()).toBe(Region.empty());
      expect(identity1.getLanguage()).toBe(Language.empty());
      expect(identity1.getAccount()).toBe(AccountName.empty());
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();

      const veauAccount1: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        new MockAccountName(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );
      const veauAccount2: Identity = Identity.of(
        new MockVeauAccountID(uuid2),
        new MockAccountName(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );
      const veauAccount3: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        new MockAccountName(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );
      const veauAccount4: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        new MockAccountName(),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid6)
        })
      );
      const veauAccount5: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        new MockAccountName('rectangle'),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        })
      );
      const veauAccount6: Identity = Identity.of(
        new MockVeauAccountID(uuid1),
        new MockAccountName(),
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

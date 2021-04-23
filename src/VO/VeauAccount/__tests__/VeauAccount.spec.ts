import { UUID } from '@jamashita/anden-uuid';
import { AccountName } from '../../Account/AccountName';
import { MockAccountName } from '../../Account/Mock/MockAccountName';
import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { VeauAccountError } from '../Error/VeauAccountError';
import { MockVeauAccountID } from '../Mock/MockVeauAccountID';
import { VeauAccount, VeauAccountJSON } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccount', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(4);

      const veauAccountID: VeauAccountID = new MockVeauAccountID();
      const languageID: LanguageID = new MockLanguageID();
      const regionID: RegionID = new MockRegionID();
      const name: AccountName = new MockAccountName();

      const veauAccount: VeauAccount = VeauAccount.of(veauAccountID, languageID, regionID, name);

      expect(veauAccount.getVeauAccountID()).toBe(veauAccountID);
      expect(veauAccount.getLanguageID()).toBe(languageID);
      expect(veauAccount.getRegionID()).toBe(regionID);
      expect(veauAccount.getAccountName()).toBe(name);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      expect.assertions(4);

      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      const veauAccount: VeauAccount = VeauAccount.ofJSON(json);

      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getLanguageID().get().get()).toBe(json.languageID);
      expect(veauAccount.getRegionID().get().get()).toBe(json.regionID);
      expect(veauAccount.getAccountName().get()).toBe(json.name);
    });

    it('veauAccountID is mal format', () => {
      expect.assertions(1);

      const json: VeauAccountJSON = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(() => {
        VeauAccount.ofJSON(json);
      }).toThrow(VeauAccountError);
    });

    it('languageID is mal format', () => {
      expect.assertions(1);

      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: 'illegal one',
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(() => {
        VeauAccount.ofJSON(json);
      }).toThrow(VeauAccountError);
    });

    it('regionID is mal format', () => {
      expect.assertions(1);

      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: 'illegal one',
        name: 'name'
      };

      expect(() => {
        VeauAccount.ofJSON(json);
      }).toThrow(VeauAccountError);
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(VeauAccount.validate(null)).toBe(false);
      expect(VeauAccount.validate(undefined)).toBe(false);
      expect(VeauAccount.validate(56)).toBe(false);
      expect(VeauAccount.validate('fjafsd')).toBe(false);
      expect(VeauAccount.validate(false)).toBe(false);
    });

    it('returns false because veauAccountID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because veauAccountID is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        veauAccountID: false,
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because languageID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        veauAccountID: 'illegal one',
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because languageID is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: undefined,
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because regionID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because regionID is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: -5,
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get()
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: null
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });
  });

  describe('empty', () => {
    it('has randomly generated id and empty name, language, and region', () => {
      expect.assertions(5);

      const account1: VeauAccount = VeauAccount.empty();
      const account2: VeauAccount = VeauAccount.empty();

      expect(account1.getVeauAccountID().get().get()).toHaveLength(UUID.size());
      expect(account1.getVeauAccountID().equals(account2.getVeauAccountID())).toBe(false);
      expect(account1.getRegionID()).toBe(RegionID.empty());
      expect(account1.getLanguageID()).toBe(LanguageID.empty());
      expect(account1.getAccountName()).toBe(AccountName.empty());
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      expect.assertions(6);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();

      const veauAccount1: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockAccountName()
      );
      const veauAccount2: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid2),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockAccountName()
      );
      const veauAccount3: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid1),
        new MockLanguageID(uuid4),
        new MockRegionID(uuid5),
        new MockAccountName()
      );
      const veauAccount4: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid6),
        new MockAccountName()
      );
      const veauAccount5: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockAccountName('rectangle')
      );
      const veauAccount6: VeauAccount = VeauAccount.of(
        new MockVeauAccountID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockAccountName()
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
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const name: string = 'veau account';

      const veauAccount: VeauAccount = VeauAccount.of(
        VeauAccountID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        AccountName.of(name)
      );

      expect(veauAccount.toJSON()).toStrictEqual({
        veauAccountID: uuid1.get(),
        languageID: uuid2.get(),
        regionID: uuid3.get(),
        name
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const name: string = 'veau account';

      const veauAccount: VeauAccount = VeauAccount.of(
        VeauAccountID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        AccountName.of(name)
      );

      expect(veauAccount.toString()).toBe(`${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${name}`);
    });
  });
});

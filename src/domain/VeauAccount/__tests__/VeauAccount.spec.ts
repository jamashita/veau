import { UUID } from '@jamashita/anden-uuid';
import { AccountName } from '../../Account/AccountName';
import { LanguageID } from '../../Language/LanguageID';
import { RegionID } from '../../Region/RegionID';
import { VeauAccount, VeauAccountJSON } from '../VeauAccount';
import { VeauAccountError } from '../VeauAccountError';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccount', () => {
  describe('of', () => {
    it('normal case', () => {
      const veauAccountID: VeauAccountID = VeauAccountID.ofString('64d3acc4-af9b-4987-8915-30f3aab698f5');
      const languageID: LanguageID = LanguageID.ofString('b902f0ba-8b13-449f-8281-16e940ede000');
      const regionID: RegionID = RegionID.ofString('6ef7ae7f-549d-4342-a70f-8a16e52dea3d');
      const name: AccountName = AccountName.empty();

      const veauAccount: VeauAccount = VeauAccount.of(veauAccountID, languageID, regionID, name);

      expect(veauAccount.getVeauAccountID()).toBe(veauAccountID);
      expect(veauAccount.getLanguageID()).toBe(languageID);
      expect(veauAccount.getRegionID()).toBe(regionID);
      expect(veauAccount.getAccountName()).toBe(name);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
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
      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(VeauAccount.validate(null)).toBe(false);
      expect(VeauAccount.validate(undefined)).toBe(false);
      expect(VeauAccount.validate(56)).toBe(false);
      expect(VeauAccount.validate('fjafsd')).toBe(false);
      expect(VeauAccount.validate(false)).toBe(false);
    });

    it('returns false because veauAccountID is missing', () => {
      const n: unknown = {
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because veauAccountID is not string', () => {
      const n: unknown = {
        veauAccountID: false,
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because languageID is missing', () => {
      const n: unknown = {
        veauAccountID: 'illegal one',
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because languageID is not string', () => {
      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: undefined,
        regionID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because regionID is missing', () => {
      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because regionID is not string', () => {
      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: -5,
        name: 'name'
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      const n: unknown = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get()
      };

      expect(VeauAccount.validate(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
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
    it('returns false if others given', () => {
      const account: VeauAccount = VeauAccount.empty();

      expect(account.equals(null)).toBe(false);
      expect(account.equals(undefined)).toBe(false);
      expect(account.equals('')).toBe(false);
      expect(account.equals('123')).toBe(false);
      expect(account.equals('abcd')).toBe(false);
      expect(account.equals(123)).toBe(false);
      expect(account.equals(0)).toBe(false);
      expect(account.equals(-12)).toBe(false);
      expect(account.equals(0.3)).toBe(false);
      expect(account.equals(false)).toBe(false);
      expect(account.equals(true)).toBe(false);
      expect(account.equals(Symbol('p'))).toBe(false);
      expect(account.equals(20n)).toBe(false);
      expect(account.equals({})).toBe(false);
      expect(account.equals([])).toBe(false);
      expect(account.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the all properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();

      const veauAccount1: VeauAccount = VeauAccount.of(
        VeauAccountID.of(uuid1),
        LanguageID.of(uuid3),
        RegionID.of(uuid5),
        AccountName.empty()
      );
      const veauAccount2: VeauAccount = VeauAccount.of(
        VeauAccountID.of(uuid2),
        LanguageID.of(uuid3),
        RegionID.of(uuid5),
        AccountName.empty()
      );
      const veauAccount3: VeauAccount = VeauAccount.of(
        VeauAccountID.of(uuid1),
        LanguageID.of(uuid4),
        RegionID.of(uuid5),
        AccountName.empty()
      );
      const veauAccount4: VeauAccount = VeauAccount.of(
        VeauAccountID.of(uuid1),
        LanguageID.of(uuid3),
        RegionID.of(uuid6),
        AccountName.empty()
      );
      const veauAccount5: VeauAccount = VeauAccount.of(
        VeauAccountID.of(uuid1),
        LanguageID.of(uuid3),
        RegionID.of(uuid5),
        AccountName.of('rectangle')
      );
      const veauAccount6: VeauAccount = VeauAccount.of(
        VeauAccountID.of(uuid1),
        LanguageID.of(uuid3),
        RegionID.of(uuid5),
        AccountName.empty()
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
});

import { Superposition, UUID } from 'publikum';
import sinon, { SinonSpy } from 'sinon';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { AccountName } from '../AccountName';
import { LanguageID } from '../LanguageID';
import { MockAccountName } from '../Mock/MockAccountName';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockVeauAccountID } from '../Mock/MockVeauAccountID';
import { RegionID } from '../RegionID';
import { VeauAccount, VeauAccountJSON } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccount', () => {
  describe('of', () => {
    it('normal case', () => {
      const veauAccountID: VeauAccountID = new MockVeauAccountID();
      const languageID: LanguageID = new MockLanguageID();
      const regionID: RegionID = new MockRegionID();
      const name: AccountName = new MockAccountName();

      const veauAccount: VeauAccount = VeauAccount.of(
        veauAccountID,
        languageID,
        regionID,
        name
      );

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

      const superposition: Superposition<VeauAccount, VeauAccountError> = VeauAccount.ofJSON(json);

      expect(superposition.isAlive()).toBe(true);
      const veauAccount: VeauAccount = superposition.get();
      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getLanguageID().get().get()).toBe(json.languageID);
      expect(veauAccount.getRegionID().get().get()).toBe(json.regionID);
      expect(veauAccount.getAccountName().get()).toBe(json.name);
    });

    it('veauAccountID is malformat', () => {
      const json: VeauAccountJSON = {
        veauAccountID: 'illegal one',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
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

    it('languageID is malformat', () => {
      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: 'illegal one',
        regionID: UUID.v4().get(),
        name: 'name'
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

    it('regionID is malformat', () => {
      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: 'illegal one',
        name: 'name'
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
      expect(account1.getRegionID()).toBe(RegionID.empty());
      expect(account1.getLanguageID()).toBe(LanguageID.empty());
      expect(account1.getAccountName()).toBe(AccountName.empty());
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

      expect(veauAccount.toJSON()).toEqual({
        veauAccountID: uuid1.get(),
        languageID: uuid2.get(),
        regionID: uuid3.get(),
        name: name
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
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

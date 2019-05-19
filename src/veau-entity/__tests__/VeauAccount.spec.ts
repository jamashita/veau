/* tslint:disable */
import 'jest';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { UUID } from '../../veau-vo/UUID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { VeauAccount } from '../VeauAccount';

describe('VeauAccount', () => {
  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const veauAccount1: VeauAccount = new VeauAccount(VeauAccountID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'veau', ISO639.of('ab'), ISO3166.of('AFG'));
      const veauAccount2: VeauAccount = new VeauAccount(VeauAccountID.of(UUID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9')), 'veau', ISO639.of('ab'), ISO3166.of('AFG'));
      const veauAccount3: VeauAccount = new VeauAccount(VeauAccountID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'veau', ISO639.of('aa'), ISO3166.of('ALB'));

      expect(veauAccount1.equals(veauAccount1)).toEqual(true);
      expect(veauAccount1.equals(veauAccount2)).toEqual(false);
      expect(veauAccount1.equals(veauAccount3)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const veauAccount: VeauAccount = new VeauAccount(VeauAccountID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'veau', ISO639.of('ab'), ISO3166.of('AFG'));

      expect(veauAccount.toJSON()).toEqual({
        veauAccountID: '998106de-b2e7-4981-9643-22cd30cd74de',
        account: 'veau',
        language: 'ab',
        region: 'AFG'
      });
    });
  });

  describe('copy', () => {
    it('each properties are copied', () => {
      const veauAccountID: VeauAccountID = VeauAccountID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de'));
      const account: string = 'veau';
      const iso639: ISO639 = ISO639.of('ab');
      const iso3166: ISO3166 = ISO3166.of('AFG');
      const veauAccount: VeauAccount = new VeauAccount(veauAccountID, account, iso639, iso3166);
      const copy: VeauAccount = veauAccount.copy();

      expect(veauAccount).not.toBe(copy);
      expect(copy.getVeauAccountID()).toEqual(veauAccountID);
      expect(copy.getAccount()).toEqual(account);
      expect(copy.getLanguage()).toEqual(iso639);
      expect(copy.getRegion()).toEqual(iso3166);
    });
  });
});

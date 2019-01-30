/* tslint:disable */
import 'jest';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { VeauAccount } from '../VeauAccount';

describe('VeauAccount', () => {
  it('equals', () => {
    const veauAccount1: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', ISO639.of('ab'), ISO3166.of('AFG'));
    const veauAccount2: VeauAccount = new VeauAccount(VeauAccountID.of(2), 'veau', ISO639.of('ab'), ISO3166.of('AFG'));
    const veauAccount3: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', ISO639.of('aa'), ISO3166.of('ALB'));

    expect(veauAccount1.equals(veauAccount1)).toEqual(true);
    expect(veauAccount1.equals(veauAccount2)).toEqual(false);
    expect(veauAccount1.equals(veauAccount3)).toEqual(true);
  });

  it('toJSON', () => {
    const veauAccount: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', ISO639.of('ab'), ISO3166.of('AFG'));

    expect(veauAccount.toJSON()).toEqual({
      id: 1,
      account: 'veau',
      language: 'ab',
      region: 'AFG'
    });
  });

  it('copy', () => {
    const veauAccountID: VeauAccountID = VeauAccountID.of(1);
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

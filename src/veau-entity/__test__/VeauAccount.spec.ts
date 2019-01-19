import 'jest';
import {ISO3166} from '../../veau-vo/ISO3166';
import {ISO639} from '../../veau-vo/ISO639';
import {VeauAccountID} from '../../veau-vo/VeauAccountID';
import {VeauAccount} from '../VeauAccount';

describe('VeauAccount', () => {
  it('equals', () => {
    const veauAccount1: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', ISO639.of('ab'), ISO3166.of('AFG'), true);
    const veauAccount2: VeauAccount = new VeauAccount(VeauAccountID.of(2), 'veau', ISO639.of('ab'), ISO3166.of('AFG'), true);
    const veauAccount3: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', ISO639.of('aa'), ISO3166.of('ALB'), true);

    expect(veauAccount1.equals(veauAccount1)).toEqual(true);
    expect(veauAccount1.equals(veauAccount2)).toEqual(false);
    expect(veauAccount1.equals(veauAccount3)).toEqual(true);
  });

  it('toJSON', () => {
    const veauAccount: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', ISO639.of('ab'), ISO3166.of('AFG'), true);

    expect(veauAccount.toJSON()).toEqual({
      id: 1,
      account: 'veau',
      language: 'ab',
      locale: 'AFG',
      active: true
    });
  });
});

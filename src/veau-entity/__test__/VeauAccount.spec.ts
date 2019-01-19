import 'jest';
import {LanguageID} from '../../veau-vo/LanguageID';
import {LocaleID} from '../../veau-vo/LocaleID';
import {VeauAccountID} from '../../veau-vo/VeauAccountID';
import {VeauAccount} from '../VeauAccount';

describe('VeauAccount', () => {
  it('equals', () => {
    const veauAccount1: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', LanguageID.of(2), LocaleID.of(3), true);
    const veauAccount2: VeauAccount = new VeauAccount(VeauAccountID.of(2), 'veau', LanguageID.of(2), LocaleID.of(3), true);
    const veauAccount3: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', LanguageID.of(8), LocaleID.of(9), true);

    expect(veauAccount1.equals(veauAccount1)).toEqual(true);
    expect(veauAccount1.equals(veauAccount2)).toEqual(false);
    expect(veauAccount1.equals(veauAccount3)).toEqual(true);
  });

  it('toJSON', () => {
    const veauAccount: VeauAccount = new VeauAccount(VeauAccountID.of(1), 'veau', LanguageID.of(2), LocaleID.of(3), true);

    expect(veauAccount.toJSON()).toEqual({
      id: 1,
      name: 'veau',
      languageID: 2,
      localeID: 3,
      active: true
    });
  });
});

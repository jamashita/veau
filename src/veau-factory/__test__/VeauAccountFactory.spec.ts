import 'jest';
import {VeauAccount, VeauAccountJSON, VeauAccountRow} from '../../veau-entity/VeauAccount';
import {LanguageID} from '../../veau-vo/LanguageID';
import {LocaleID} from '../../veau-vo/LocaleID';
import {VeauAccountID} from '../../veau-vo/VeauAccountID';
import {VeauAccountFactory} from '../VeauAccountFactory';

describe('VeauAccountFactory', () => {
  it('from', () => {
    const veauAccountID: VeauAccountID = VeauAccountID.of(1);
    const account: string = 'account';
    const languageID: LanguageID = LanguageID.of(2);
    const localeID: LocaleID = LocaleID.of(3);
    const active: boolean = true;

    const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
    const veauAccount: VeauAccount = veauAccountFactory.from(veauAccountID, account, languageID, localeID, active);

    expect(veauAccount.getVeauAccountID().equals(veauAccountID)).toEqual(true);
    expect(veauAccount.getAccount()).toEqual(account);
    expect(veauAccount.getLanguageID().equals(languageID)).toEqual(true);
    expect(veauAccount.getLocaleID().equals(localeID)).toEqual(true);
    expect(veauAccount.isActive()).toEqual(active);
  });

  it('fromJSON', () => {
    const json: VeauAccountJSON = {
      id: 1,
      account: 'account',
      languageID: 2,
      localeID: 3,
      active: true
    };

    const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
    const veauAccount: VeauAccount = veauAccountFactory.fromJSON(json);

    expect(veauAccount.getVeauAccountID().get()).toEqual(json.id);
    expect(veauAccount.getAccount()).toEqual(json.account);
    expect(veauAccount.getLanguageID().get()).toEqual(json.languageID);
    expect(veauAccount.getLocaleID().get()).toEqual(json.localeID);
    expect(veauAccount.isActive()).toEqual(json.active);
  });


  it('fromRow', () => {
    const row: VeauAccountRow = {
      id: 1,
      account: 'account',
      languageID: 2,
      localeID: 3,
      active: 1
    };

    const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
    const veauAccount: VeauAccount = veauAccountFactory.fromRow(row);

    expect(veauAccount.getVeauAccountID().get()).toEqual(row.id);
    expect(veauAccount.getAccount()).toEqual(row.account);
    expect(veauAccount.getLanguageID().get()).toEqual(row.languageID);
    expect(veauAccount.getLocaleID().get()).toEqual(row.localeID);
    expect(veauAccount.isActive()).toEqual(Boolean(row.active));
  });
});

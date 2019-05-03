/* tslint:disable */
import 'jest';
import { VeauAccount, VeauAccountJSON, VeauAccountRow } from '../../veau-entity/VeauAccount';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { UUID } from '../../veau-vo/UUID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { VeauAccountFactory } from '../VeauAccountFactory';

describe('VeauAccountFactory', () => {
  it('from', () => {
    const veauAccountID: VeauAccountID = VeauAccountID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de'));
    const account: string = 'account';
    const language: ISO639 = ISO639.of('ab');
    const region: ISO3166 = ISO3166.of('AFG');

    const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
    const veauAccount: VeauAccount = veauAccountFactory.from(veauAccountID, account, language, region);

    expect(veauAccount.getVeauAccountID().equals(veauAccountID)).toEqual(true);
    expect(veauAccount.getAccount()).toEqual(account);
    expect(veauAccount.getLanguage().equals(language)).toEqual(true);
    expect(veauAccount.getRegion().equals(region)).toEqual(true);
  });

  it('fromJSON', () => {
    const json: VeauAccountJSON = {
      veauAccountID: '998106de-b2e7-4981-9643-22cd30cd74de',
      account: 'account',
      language: 'ab',
      region: 'AFG'
    };

    const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
    const veauAccount: VeauAccount = veauAccountFactory.fromJSON(json);

    expect(veauAccount.getVeauAccountID().get().get()).toEqual(json.veauAccountID);
    expect(veauAccount.getAccount()).toEqual(json.account);
    expect(veauAccount.getLanguage().get()).toEqual(json.language);
    expect(veauAccount.getRegion().get()).toEqual(json.region);
  });


  it('fromRow', () => {
    const row: VeauAccountRow = {
      veauAccountID: '998106de-b2e7-4981-9643-22cd30cd74de',
      account: 'account',
      language: 'ab',
      region: 'AFG',
      hash: ''
    };

    const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
    const veauAccount: VeauAccount = veauAccountFactory.fromRow(row);

    expect(veauAccount.getVeauAccountID().get().get()).toEqual(row.veauAccountID);
    expect(veauAccount.getAccount()).toEqual(row.account);
    expect(veauAccount.getLanguage().get()).toEqual(row.language);
    expect(veauAccount.getRegion().get()).toEqual(row.region);
  });
});

/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { VeauAccount } from '../../veau-entity/VeauAccount';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { VeauAccountHash, VeauAccountMySQLQuery } from '../VeauAccountMySQLQuery';

describe('VeauAccountMySQLQuery', () => {
  it('findByAccount', async () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.resolves([
      {
        id: '998106de-b2e7-4981-9643-22cd30cd74de',
        account: 'account',
        language: 'ab',
        region: 'AFG'
      }
    ]);

    const veauAccountQuery: VeauAccountMySQLQuery = VeauAccountMySQLQuery.getInstance();
    const veauAccountHash: VeauAccountHash = await veauAccountQuery.findByAccount('account');
    const veauAccount: VeauAccount = veauAccountHash.veauAccount;

    expect(veauAccount.getVeauAccountID().get().get()).toEqual('998106de-b2e7-4981-9643-22cd30cd74de');
    expect(veauAccount.getAccount()).toEqual('account');
    expect(veauAccount.getLanguage().get()).toEqual('ab');
    expect(veauAccount.getRegion().get()).toEqual('AFG');
  });
});

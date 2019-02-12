/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { VeauAccount } from '../../veau-entity/VeauAccount';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { VeauAccountHash, VeauAccountRepository } from '../VeauAccountRepository';

describe('VeauAccountRepository', () => {
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

    const veauAccountRepository: VeauAccountRepository = VeauAccountRepository.getInstance();
    const veauAccountHash: VeauAccountHash = await veauAccountRepository.findByAccount('account');
    const veauAccount: VeauAccount = veauAccountHash.veauAccount;

    expect(veauAccount.getVeauAccountID().get().get()).toEqual('998106de-b2e7-4981-9643-22cd30cd74de');
    expect(veauAccount.getAccount()).toEqual('account');
    expect(veauAccount.getLanguage().get()).toEqual('ab');
    expect(veauAccount.getRegion().get()).toEqual('AFG');
  });
});

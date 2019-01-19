import 'jest';
import {SinonStub} from 'sinon';
import * as sinon from 'sinon';
import {VeauAccount} from '../../veau-entity/VeauAccount';
import {VeauMySQL} from '../../veau-infrastructure/VeauMySQL';
import {VeauAccountHash, VeauAccountRepository} from '../VeauAccountRepository';

describe('VeauAccountRepository', () => {
  it('findByAccount', async () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.returns([
      {
        id: 1,
        account: 'account',
        language: 'ab',
        locale: 'AFG',
        active: 1
      }
    ]);

    const veauAccountRepository: VeauAccountRepository = VeauAccountRepository.getInstance();
    const veauAccountHash: VeauAccountHash = await veauAccountRepository.findByAccount('account');
    const veauAccount: VeauAccount = veauAccountHash.veauAccount;

    expect(veauAccount.getVeauAccountID().get()).toEqual(1);
    expect(veauAccount.getAccount()).toEqual('account');
    expect(veauAccount.getLanguage().get()).toEqual('ab');
    expect(veauAccount.getLocale().get()).toEqual('AFG');
    expect(veauAccount.isActive()).toEqual(true);
  });
});

import 'jest';
import {SinonStub} from 'sinon';
import * as sinon from 'sinon';
import {VeauAccount} from '../../veau-entity/VeauAccount';
import {VeauMySQL} from '../../veau-infrastructure/VeauMySQL';
import {VeauAccountRepository} from '../VeauAccountRepository';

describe('VeauAccountRepository', () => {
  it('findByName', async () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.returns([
      {
        id: 1,
        account: 'account',
        languageID: 2,
        localeID: 3,
        active: 1
      }
    ]);

    const veauAccountRepository: VeauAccountRepository = VeauAccountRepository.getInstance();
    const veauAccount: VeauAccount = await veauAccountRepository.findByName('account');

    expect(veauAccount.getVeauAccountID().get()).toEqual(1);
    expect(veauAccount.getAccount()).toEqual('account');
    expect(veauAccount.getLanguageID().get()).toEqual(2);
    expect(veauAccount.getLocaleID().get()).toEqual(3);
    expect(veauAccount.isActive()).toEqual(true);
  });
});

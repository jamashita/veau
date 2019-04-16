/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { Digest } from '../../veau-general/Digest';
import { NoSuchElementError } from '../../veau-general/Error/NoSuchElementError';
import { VeauAccountMySQLQuery } from '../../veau-query/VeauAccountMySQLQuery';
import { AuthenticationUseCase } from '../AuthenticationUseCase';

describe('AuthenticationUseCase', () => {
  it('account not found', (done) => {
    const account: string = 'dummy account';
    const password: string = 'dummy password';

    const stub1: SinonStub = sinon.stub();
    VeauAccountMySQLQuery.prototype.findByAccount = stub1;
    stub1.rejects(new NoSuchElementError(account));
    const stub2: SinonStub = sinon.stub();
    Digest.compare = stub2;
    stub2.resolves(true);

    const authenticationUseCase: AuthenticationUseCase = AuthenticationUseCase.getInstance();
    authenticationUseCase.review(account, password, (err: any, ret: any) => {
      expect(err).toEqual(null);
      expect(ret).toEqual(false);
      done();
    });
  });

  it('Digest.compare returns false', (done) => {
    const account: string = 'dummy account';
    const password: string = 'dummy password';

    const stub1: SinonStub = sinon.stub();
    VeauAccountMySQLQuery.prototype.findByAccount = stub1;
    stub1.resolves({
      veauAccount: null,
      hash: 'dummy hash'
    });
    const stub2: SinonStub = sinon.stub();
    Digest.compare = stub2;
    stub2.resolves(false);

    const authenticationUseCase: AuthenticationUseCase = AuthenticationUseCase.getInstance();
    authenticationUseCase.review(account, password, (err: any, ret: any) => {
      expect(err).toEqual(null);
      expect(ret).toEqual(false);
      done();
    });
  });

  it('normal case', (done) => {
    const account: string = 'dummy account';
    const password: string = 'dummy password';

    const stub1: SinonStub = sinon.stub();
    VeauAccountMySQLQuery.prototype.findByAccount = stub1;
    stub1.resolves({
      veauAccount: 'dummy veauAccount',
      hash: 'dummy hash'
    });
    const stub2: SinonStub = sinon.stub();
    Digest.compare = stub2;
    stub2.resolves(true);

    const authenticationUseCase: AuthenticationUseCase = AuthenticationUseCase.getInstance();
    authenticationUseCase.review(account, password, (err: any, ret: any) => {
      expect(err).toEqual(null);
      expect(ret).toEqual('dummy veauAccount');
      done();
    });
  });
});

import 'jest';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Digest } from '../../veau-general/Digest';
import { VeauAccountQuery } from '../../veau-query/VeauAccountQuery';
import { AuthenticationInteractor } from '../AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const authenticationInteractor1: AuthenticationInteractor = container.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);
      const authenticationInteractor2: AuthenticationInteractor = container.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);

      expect(authenticationInteractor1 instanceof AuthenticationInteractor).toEqual(true);
      expect(authenticationInteractor1).toBe(authenticationInteractor2);
    });
  });

  describe('review', () => {
    it('account not found', (done) => {
      const account: string = 'dummy account';
      const password: string = 'dummy password';

      const stub1: SinonStub = sinon.stub();
      VeauAccountQuery.prototype.findByAccount = stub1;
      stub1.rejects(new NoSuchElementError(account));
      const stub2: SinonStub = sinon.stub();
      Digest.compare = stub2;
      stub2.resolves(true);

      const authenticationInteractor: AuthenticationInteractor = container.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);
      authenticationInteractor.review()(account, password, (err: unknown, ret: unknown) => {
        expect(err).toEqual(null);
        expect(ret).toEqual(false);
        done();
      });
    });

    it('Digest.compare returns false', (done) => {
      const account: string = 'dummy account';
      const password: string = 'dummy password';

      const stub1: SinonStub = sinon.stub();
      VeauAccountQuery.prototype.findByAccount = stub1;
      stub1.resolves({
        veauAccount: null,
        hash: 'dummy hash'
      });
      const stub2: SinonStub = sinon.stub();
      Digest.compare = stub2;
      stub2.resolves(false);

      const authenticationInteractor: AuthenticationInteractor = container.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);
      authenticationInteractor.review()(account, password, (err: unknown, ret: unknown) => {
        expect(err).toEqual(null);
        expect(ret).toEqual(false);
        done();
      });
    });

    it('normal case', (done) => {
      const account: string = 'dummy account';
      const password: string = 'dummy password';

      const stub1: SinonStub = sinon.stub();
      VeauAccountQuery.prototype.findByAccount = stub1;
      stub1.resolves({
        veauAccount: 'dummy veauAccount',
        hash: 'dummy hash'
      });
      const stub2: SinonStub = sinon.stub();
      Digest.compare = stub2;
      stub2.resolves(true);

      const authenticationInteractor: AuthenticationInteractor = container.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);
      authenticationInteractor.review()(account, password, (err: unknown, ret: unknown) => {
        expect(err).toEqual(null);
        expect(ret).toEqual('dummy veauAccount');
        done();
      });
    });
  });
});

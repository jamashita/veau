import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { MockAccountQuery } from '../../Query/Mock/MockAccountQuery';
import { Account } from '../../VO/Account';
import { MockAccount } from '../../VO/Mock/MockAccount';
import { MockAccountName } from '../../VO/Mock/MockAccountName';
import { MockLanguage } from '../../VO/Mock/MockLanguage';
import { MockRegion } from '../../VO/Mock/MockRegion';
import { VeauAccount } from '../../VO/VeauAccount';
import { AuthenticationInteractor } from '../AuthenticationInteractor';

// ODNE
describe('AuthenticationInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const authenticationInteractor1: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);
      const authenticationInteractor2: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);

      expect(authenticationInteractor1).toBeInstanceOf(AuthenticationInteractor);
      expect(authenticationInteractor1).toBe(authenticationInteractor2);
    });
  });

  describe('review', () => {
    it('normal case', (done) => {
      const name: string = 'dummy name';
      const password: string = 'dummy password';
      const account: MockAccount = new MockAccount({
        account: new MockAccountName('veau'),
        language: new MockLanguage(),
        region: new MockRegion()
      });

      const accountQuery: MockAccountQuery = new MockAccountQuery();
      const stub1: SinonStub = sinon.stub();
      accountQuery.findByAccount = stub1;
      stub1.resolves(Success.of<Account, NoSuchElementError>(account));
      const stub2: SinonStub = sinon.stub();
      account.verify = stub2;
      stub2.resolves(true);

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);
      authenticationInteractor.review()(name, password, (err: unknown, ret: VeauAccount) => {
        expect(err).toEqual(null);
        expect(ret.getVeauAccountID()).toEqual(account.getVeauAccountID());
        expect(ret.getAccount()).toEqual(account.getAccount());
        expect(ret.getLanguage()).toEqual(account.getLanguage());
        expect(ret.getRegion()).toEqual(account.getRegion());
        done();
      });
    });

    it('name not found', (done) => {
      const name: string = 'dummy name';
      const password: string = 'dummy password';

      const accountQuery: MockAccountQuery = new MockAccountQuery();
      const stub: SinonStub = sinon.stub();
      accountQuery.findByAccount = stub;
      stub.resolves(Failure.of<Account, NoSuchElementError>(new NoSuchElementError('test failed')));

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);
      authenticationInteractor.review()(name, password, (err: unknown, ret: unknown) => {
        expect(err).toEqual(null);
        expect(ret).toEqual(false);
        done();
      });
    });

    it('Account.verify returns false', (done) => {
      const name: string = 'dummy name';
      const password: string = 'dummy password';
      const account: MockAccount = new MockAccount();

      const accountQuery: MockAccountQuery = new MockAccountQuery();
      const stub1: SinonStub = sinon.stub();
      accountQuery.findByAccount = stub1;
      stub1.resolves(Success.of<Account, NoSuchElementError>(account));
      const stub2: SinonStub = sinon.stub();
      account.verify = stub2;
      stub2.resolves(false);

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);
      authenticationInteractor.review()(name, password, (err: unknown, ret: unknown) => {
        expect(err).toEqual(null);
        expect(ret).toEqual(false);
        done();
      });
    });
  });
});

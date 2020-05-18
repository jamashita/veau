import { Alive, Dead } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { MockAccountQuery } from '../../Query/Mock/MockAccountQuery';
import { Account } from '../../VO/Account';
import { MockAccount } from '../../VO/Mock/MockAccount';
import { VeauAccount } from '../../VO/VeauAccount';
import { AuthenticationInteractor } from '../AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const authenticationInteractor1: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(
        TYPE.AuthenticationInteractor
      );
      const authenticationInteractor2: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(
        TYPE.AuthenticationInteractor
      );

      expect(authenticationInteractor1).toBeInstanceOf(AuthenticationInteractor);
      expect(authenticationInteractor1).toBe(authenticationInteractor2);
    });
  });

  describe('review', () => {
    it('normal case', (done) => {
      const name: string = 'dummy name';
      const password: string = 'dummy password';
      const account: MockAccount = new MockAccount();

      const accountQuery: MockAccountQuery = new MockAccountQuery();
      const stub1: SinonStub = sinon.stub();
      accountQuery.findByAccount = stub1;
      stub1.resolves(Alive.of<Account, NoSuchElementError>(account));
      const stub2: SinonStub = sinon.stub();
      account.verify = stub2;
      stub2.resolves(true);

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);
      authenticationInteractor.review()(name, password, (err: unknown, ret: VeauAccount) => {
        expect(err).toBe(null);
        expect(ret).toBe(account.getVeauAccount());
        done();
      });
    });

    it('name not found', (done) => {
      const name: string = 'dummy name';
      const password: string = 'dummy password';

      const accountQuery: MockAccountQuery = new MockAccountQuery();
      const stub: SinonStub = sinon.stub();
      accountQuery.findByAccount = stub;
      stub.resolves(Dead.of<Account, NoSuchElementError>(new NoSuchElementError('test failed')));

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);
      authenticationInteractor.review()(name, password, (err: unknown, ret: unknown) => {
        expect(err).toBe(null);
        expect(ret).toBe(false);
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
      stub1.resolves(Alive.of<Account, NoSuchElementError>(account));
      const stub2: SinonStub = sinon.stub();
      account.verify = stub2;
      stub2.resolves(false);

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);
      authenticationInteractor.review()(name, password, (err: unknown, ret: unknown) => {
        expect(err).toBe(null);
        expect(ret).toBe(false);
        done();
      });
    });
  });
});

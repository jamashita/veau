import { Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { MockAccountQuery } from '../../Query/Mock/MockAccountQuery';
import { Account } from '../../domain/vo/Account/Account';
import { MockAccount } from '../../domain/vo/Account/Mock/MockAccount';
import { VeauAccount } from '../../domain/vo/VeauAccount/VeauAccount';
import { AuthenticationInteractor } from '../AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const authenticationInteractor1: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(Type.AuthenticationInteractor);
      const authenticationInteractor2: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(Type.AuthenticationInteractor);

      expect(authenticationInteractor1).toBeInstanceOf(AuthenticationInteractor);
      expect(authenticationInteractor1).toBe(authenticationInteractor2);
    });
  });

  describe('review', () => {
    it('normal case', (done: jest.DoneCallback) => {
      expect.assertions(2);

      const name: string = 'dummy name';
      const password: string = 'dummy password';
      const account: MockAccount = new MockAccount();

      const accountQuery: MockAccountQuery = new MockAccountQuery();
      const stub1: SinonStub = sinon.stub();

      accountQuery.findByAccount = stub1;
      stub1.returns(Superposition.alive<Account, NoSuchElementError>(account, NoSuchElementError));

      const stub2: SinonStub = sinon.stub();

      account.verify = stub2;
      stub2.returns(true);

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);

      authenticationInteractor.review()(name, password, (err: unknown, ret: VeauAccount) => {
        expect(err).toBeNull();
        expect(ret).toBe(account.getVeauAccount());
        done();
      });
    });

    it('name not found', (done: jest.DoneCallback) => {
      expect.assertions(2);

      const name: string = 'dummy name';
      const password: string = 'dummy password';

      const accountQuery: MockAccountQuery = new MockAccountQuery();
      const stub: SinonStub = sinon.stub();

      accountQuery.findByAccount = stub;
      stub.returns(Superposition.dead<Account, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError));

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);

      authenticationInteractor.review()(name, password, (err: unknown, ret: unknown) => {
        expect(err).toBeNull();
        expect(ret).toBe(false);
        done();
      });
    }, 20000);

    it('account.verify returns false', (done: jest.DoneCallback) => {
      expect.assertions(2);

      const name: string = 'dummy name';
      const password: string = 'dummy password';
      const account: MockAccount = new MockAccount();

      const accountQuery: MockAccountQuery = new MockAccountQuery();
      const stub1: SinonStub = sinon.stub();

      accountQuery.findByAccount = stub1;
      stub1.returns(Superposition.alive<Account, NoSuchElementError>(account, NoSuchElementError));

      const stub2: SinonStub = sinon.stub();

      account.verify = stub2;
      stub2.returns(false);

      const authenticationInteractor: AuthenticationInteractor = new AuthenticationInteractor(accountQuery);

      authenticationInteractor.review()(name, password, (err: unknown, ret: unknown) => {
        expect(err).toBeNull();
        expect(ret).toBe(false);
        done();
      });
    });
  });
});

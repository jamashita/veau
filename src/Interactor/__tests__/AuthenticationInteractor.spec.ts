import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { MockAccountQuery } from '../../Query/Mock/MockAccountQuery';
import { Account } from '../../VO/Account';
import { AccountName } from '../../VO/AccountName';
import { Hash } from '../../VO/Hash';
import { ISO3166 } from '../../VO/ISO3166';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { LanguageID } from '../../VO/LanguageID';
import { LanguageName } from '../../VO/LanguageName';
import { Region } from '../../VO/Region';
import { RegionID } from '../../VO/RegionID';
import { RegionName } from '../../VO/RegionName';
import { VeauAccount } from '../../VO/VeauAccount';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { AuthenticationInteractor } from '../AuthenticationInteractor';

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
      const account: Account = Account.of(
        VeauAccountID.ofString('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get(),
        AccountName.of('veau'),
        Language.of(LanguageID.of(1),
          LanguageName.of('аҧсуа бызшәа'),
          LanguageName.of('Abkhazian'),
          ISO639.of('ab')),
        Region.of(RegionID.of(1),
          RegionName.of('Afghanistan'),
          ISO3166.of('AFG')),
        Hash.of('hash 1')
      );

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
      const account: Account = Account.of(
        VeauAccountID.ofString('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get(),
        AccountName.of('veau'),
        Language.of(LanguageID.of(1),
          LanguageName.of('аҧсуа бызшәа'),
          LanguageName.of('Abkhazian'),
          ISO639.of('ab')),
        Region.of(RegionID.of(1),
          RegionName.of('Afghanistan'),
          ISO3166.of('AFG')),
        Hash.of('hash 1')
      );

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

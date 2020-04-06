import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { AccountQuery } from '../../veau-query/AccountQuery';
import { Account } from '../../veau-vo/Account';
import { AccountName } from '../../veau-vo/AccountName';
import { Hash } from '../../veau-vo/Hash';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { VeauAccount } from '../../veau-vo/VeauAccount';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
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
    it('name not found', (done) => {
      const name: string = 'dummy name';
      const password: string = 'dummy password';

      const stub1: SinonStub = sinon.stub();
      AccountQuery.prototype.findByAccount = stub1;
      stub1.resolves(Failure.of<Account, NoSuchElementError>(new NoSuchElementError(name)));
      const stub2: SinonStub = sinon.stub();
      Account.prototype.verify = stub2;
      stub2.resolves(true);

      const authenticationInteractor: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);
      authenticationInteractor.review()(name, password, (err: unknown, ret: unknown) => {
        expect(err).toEqual(null);
        expect(ret).toEqual(false);
        done();
      });
    });

    it('Digest.compare returns false', (done) => {
      const name: string = 'dummy name';
      const password: string = 'dummy password';

      const stub1: SinonStub = sinon.stub();
      AccountQuery.prototype.findByAccount = stub1;
      const account: Account = Account.of(VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get(), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')), Hash.of('hash 1'));
      stub1.resolves(Success.of<Account, NoSuchElementError>(account));
      const stub2: SinonStub = sinon.stub();
      Account.prototype.verify = stub2;
      stub2.resolves(false);

      const authenticationInteractor: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);
      authenticationInteractor.review()(name, password, (err: unknown, ret: unknown) => {
        expect(err).toEqual(null);
        expect(ret).toEqual(false);
        done();
      });
    });

    it('normal case', (done) => {
      const name: string = 'dummy name';
      const password: string = 'dummy password';

      const stub1: SinonStub = sinon.stub();
      AccountQuery.prototype.findByAccount = stub1;
      const account: Account = Account.of(VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get(), AccountName.of('veau'), Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')), Hash.of('hash 1'));
      stub1.resolves(Success.of<Account, NoSuchElementError>(account));
      const stub2: SinonStub = sinon.stub();
      Account.prototype.verify = stub2;
      stub2.resolves(true);

      const authenticationInteractor: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);
      authenticationInteractor.review()(name, password, (err: unknown, ret: VeauAccount) => {
        expect(err).toEqual(null);
        expect(ret.getVeauAccountID()).toEqual(account.getVeauAccountID());
        expect(ret.getAccount()).toEqual(account.getAccount());
        expect(ret.getLanguage()).toEqual(account.getLanguage());
        expect(ret.getRegion()).toEqual(account.getRegion());
        done();
      });
    });
  });
});

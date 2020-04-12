import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { AuthenticationFailureError } from '../../../veau-error/AuthenticationFailureError';
import { UnauthorizedError } from '../../../veau-error/UnauthorizedError';
import { VeauAccountError } from '../../../veau-error/VeauAccountError';
import { AJAXError } from '../../../veau-general/AJAX/AJAXError';
import { MockAJAX } from '../../../veau-general/AJAX/Mock/MockAJAX';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { Try } from '../../../veau-general/Try/Try';
import { AccountName } from '../../../veau-vo/AccountName';
import { EntranceInformation } from '../../../veau-vo/EntranceInformation';
import { Password } from '../../../veau-vo/Password';
import { VeauAccount, VeauAccountJSON } from '../../../veau-vo/VeauAccount';
import { SessionQuery } from '../SessionQuery';

describe('SessionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const sessionQuery1: SessionQuery = vault.get<SessionQuery>(TYPE.SessionAJAXQuery);
      const sessionQuery2: SessionQuery = vault.get<SessionQuery>(TYPE.SessionAJAXQuery);

      expect(sessionQuery1).toBeInstanceOf(SessionQuery);
      expect(sessionQuery1).toBe(sessionQuery2);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      const json: VeauAccountJSON = {
        veauAccountID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
        account: 'account',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english language',
          iso639: 'aa'
        },
        region: {
          regionID: 2,
          name: 'region',
          iso3166: 'bb'
        }
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const trial: Try<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError> = await sessionQuery.find();

      expect(stub.withArgs('/api/identity').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const veauAccount: VeauAccount = trial.get();
      expect(veauAccount.getVeauAccountID().get().get()).toEqual(json.veauAccountID);
      expect(veauAccount.getAccount().get()).toEqual(json.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(veauAccount.getLanguage().getName().get()).toEqual(json.language.name);
      expect(veauAccount.getLanguage().getEnglishName().get()).toEqual(json.language.englishName);
      expect(veauAccount.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(veauAccount.getRegion().getName().get()).toEqual(json.region.name);
      expect(veauAccount.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
    });

    it('returns Failure when it has wrong format veauAccountID', async () => {
      const json: VeauAccountJSON = {
        veauAccountID: 'malformat uuid',
          account: 'account',
          language: {
          languageID: 1,
            name: 'language',
            englishName: 'english language',
            iso639: 'aa'
        },
        region: {
          regionID: 2,
            name: 'region',
            iso3166: 'bb'
        }
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const trial: Try<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError> = await sessionQuery.find();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | UnauthorizedError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(VeauAccountError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('doesn\'t return OK', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const trial: Try<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError> = await sessionQuery.find();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | UnauthorizedError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(UnauthorizedError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByEntranceInfo', () => {
    it('normal case', async () => {
      const json: VeauAccountJSON = {
        veauAccountID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
        account: 'account',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english language',
          iso639: 'aa'
        },
        region: {
          regionID: 2,
          name: 'region',
          iso3166: 'bb'
        }
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const trial: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError> = await sessionQuery.findByEntranceInfo(info);

      expect(stub.withArgs('/api/auth', {
        account: 'account',
        password: 'password'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const veauAccount: VeauAccount = trial.get();
      expect(veauAccount.getVeauAccountID().get().get()).toEqual(json.veauAccountID);
      expect(veauAccount.getAccount().get()).toEqual(json.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(veauAccount.getLanguage().getName().get()).toEqual(json.language.name);
      expect(veauAccount.getLanguage().getEnglishName().get()).toEqual(json.language.englishName);
      expect(veauAccount.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(veauAccount.getRegion().getName().get()).toEqual(json.region.name);
      expect(veauAccount.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
    });

    it('returns Failure when it has wrong format veauAccountID', async () => {
      const json: VeauAccountJSON = {
        veauAccountID: 'malformat uuid',
        account: 'account',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english language',
          iso639: 'aa'
        },
        region: {
          regionID: 2,
          name: 'region',
          iso3166: 'bb'
        }
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: OK,
        body: json
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const trial: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError> = await sessionQuery.findByEntranceInfo(info);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | AuthenticationFailureError | AJAXError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(VeauAccountError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns UNAUTHORIZED', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: UNAUTHORIZED,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const trial: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError> = await sessionQuery.findByEntranceInfo(info);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | AuthenticationFailureError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AuthenticationFailureError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('doesn\'t return OK nor UNAUTHORIZED', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const info: EntranceInformation = EntranceInformation.of(AccountName.of('account'), Password.of('password'));
      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const trial: Try<VeauAccount, VeauAccountError | AuthenticationFailureError | DataSourceError> = await sessionQuery.findByEntranceInfo(info);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | AuthenticationFailureError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});

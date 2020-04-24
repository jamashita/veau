import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import { AJAXError, DataSourceError, MockAJAX, Superposition } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { VeauAccountError } from '../../../Error/VeauAccountError';
import { MockAccountName } from '../../../VO/Mock/MockAccountName';
import { MockEntranceInformation } from '../../../VO/Mock/MockEntranceInformation';
import { MockPassword } from '../../../VO/Mock/MockPassword';
import { VeauAccount, VeauAccountJSON } from '../../../VO/VeauAccount';
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
      const superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await sessionQuery.find();

      expect(stub.withArgs('/api/identity').called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const veauAccount: VeauAccount = superposition.get();
      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getAccount().get()).toBe(json.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toBe(json.language.languageID);
      expect(veauAccount.getLanguage().getName().get()).toBe(json.language.name);
      expect(veauAccount.getLanguage().getEnglishName().get()).toBe(json.language.englishName);
      expect(veauAccount.getLanguage().getISO639().get()).toBe(json.language.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toBe(json.region.regionID);
      expect(veauAccount.getRegion().getName().get()).toBe(json.region.name);
      expect(veauAccount.getRegion().getISO3166().get()).toBe(json.region.iso3166);
    });

    it('returns Dead when it has wrong format veauAccountID', async () => {
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
      const superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await sessionQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(VeauAccountError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('doesn\'t return OK', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await sessionQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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

      const info: MockEntranceInformation = new MockEntranceInformation({
        account: new MockAccountName('account'),
        password: new MockPassword('password')
      });
      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await sessionQuery.findByEntranceInfo(info);

      expect(stub.withArgs('/api/auth', {
        account: 'account',
        password: 'password'
      }).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const veauAccount: VeauAccount = superposition.get();
      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getAccount().get()).toBe(json.account);
      expect(veauAccount.getLanguage().getLanguageID().get()).toBe(json.language.languageID);
      expect(veauAccount.getLanguage().getName().get()).toBe(json.language.name);
      expect(veauAccount.getLanguage().getEnglishName().get()).toBe(json.language.englishName);
      expect(veauAccount.getLanguage().getISO639().get()).toBe(json.language.iso639);
      expect(veauAccount.getRegion().getRegionID().get()).toBe(json.region.regionID);
      expect(veauAccount.getRegion().getName().get()).toBe(json.region.name);
      expect(veauAccount.getRegion().getISO3166().get()).toBe(json.region.iso3166);
    });

    it('returns Dead when it has wrong format veauAccountID', async () => {
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

      const info: MockEntranceInformation = new MockEntranceInformation();
      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await sessionQuery.findByEntranceInfo(info);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(VeauAccountError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns UNAUTHORIZED', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: UNAUTHORIZED,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const info: MockEntranceInformation = new MockEntranceInformation();
      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await sessionQuery.findByEntranceInfo(info);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('doesn\'t return OK nor UNAUTHORIZED', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const info: MockEntranceInformation = new MockEntranceInformation();
      const sessionQuery: SessionQuery = new SessionQuery(ajax);
      const superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await sessionQuery.findByEntranceInfo(info);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: VeauAccountError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});

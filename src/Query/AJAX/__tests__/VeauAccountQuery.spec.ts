import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import { AJAXError, DataSourceError, MockAJAX, Superposition, UUID } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { VeauAccountError } from '../../../VO/VeauAccount/Error/VeauAccountError';
import { MockAccountName } from '../../../VO/Account/Mock/MockAccountName';
import { MockEntranceInformation } from '../../../VO/EntranceInformation/Mock/MockEntranceInformation';
import { MockPassword } from '../../../VO/EntranceInformation/Mock/MockPassword';
import { VeauAccount, VeauAccountJSON } from '../../../VO/VeauAccount/VeauAccount';
import { VeauAccountQuery } from '../VeauAccountQuery';

describe('VeauAccountQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const veauAccountQuery1: VeauAccountQuery = vault.get<VeauAccountQuery>(TYPE.VeauAccountAJAXQuery);
      const veauAccountQuery2: VeauAccountQuery = vault.get<VeauAccountQuery>(TYPE.VeauAccountAJAXQuery);

      expect(veauAccountQuery1).toBeInstanceOf(VeauAccountQuery);
      expect(veauAccountQuery1).toBe(veauAccountQuery2);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const superposition: Superposition<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.find();

      expect(stub.withArgs('/api/accounts').called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const veauAccount: VeauAccount = superposition.get();
      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getLanguageID().get().get()).toBe(json.languageID);
      expect(veauAccount.getRegionID().get().get()).toBe(json.regionID);
      expect(veauAccount.getAccountName().get()).toBe(json.name);
    });

    it('returns Dead when it has wrong format veauAccountID', async () => {
      const json: VeauAccountJSON = {
        veauAccountID: 'malformat uuid',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
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

      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const superposition: Superposition<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: VeauAccountError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(VeauAccountError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('does not return OK', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const superposition: Superposition<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: VeauAccountError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(DataSourceError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByEntranceInfo', () => {
    it('normal case', async () => {
      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const info: MockEntranceInformation = new MockEntranceInformation({
        account: new MockAccountName('name'),
        password: new MockPassword('password')
      });
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const superposition: Superposition<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.findByEntranceInfo(info);

      expect(
        stub.withArgs('/api/auth', {
          account: 'name',
          password: 'password'
        }).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const veauAccount: VeauAccount = superposition.get();
      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getLanguageID().get().get()).toBe(json.languageID);
      expect(veauAccount.getRegionID().get().get()).toBe(json.regionID);
      expect(veauAccount.getAccountName().get()).toBe(json.name);
    });

    it('returns Dead when it has wrong format veauAccountID', async () => {
      const json: VeauAccountJSON = {
        veauAccountID: 'malformat uuid',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
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
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const superposition: Superposition<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.findByEntranceInfo(info);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: VeauAccountError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(VeauAccountError);
        }
      );

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
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const superposition: Superposition<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.findByEntranceInfo(info);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: VeauAccountError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(DataSourceError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it("doesn't return OK nor UNAUTHORIZED", async () => {
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
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const superposition: Superposition<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.findByEntranceInfo(info);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: VeauAccountError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});

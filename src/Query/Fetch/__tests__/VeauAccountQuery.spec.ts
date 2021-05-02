import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError, MockFetch } from '@jamashita/catacombe-fetch';
import { Schrodinger } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { AccountName } from '../../../domain/VO/Account/AccountName';
import { MockEntranceInformation } from '../../../domain/VO/EntranceInformation/Mock/MockEntranceInformation';
import { MockPassword } from '../../../domain/VO/EntranceInformation/Mock/MockPassword';
import { VeauAccountError } from '../../../domain/VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount, VeauAccountJSON } from '../../../domain/VO/VeauAccount/VeauAccount';
import { VeauAccountQuery } from '../VeauAccountQuery';

describe('VeauAccountQuery', () => {
  // TODO
  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('container', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  //   it('must be a singleton', () => {
  //     const veauAccountQuery1: VeauAccountQuery = v.get<VeauAccountQuery>(Type.VeauAccountFetchQuery);
  //     const veauAccountQuery2: VeauAccountQuery = v.get<VeauAccountQuery>(Type.VeauAccountFetchQuery);
  //
  //     expect(veauAccountQuery1).toBeInstanceOf(VeauAccountQuery);
  //     expect(veauAccountQuery1).toBe(veauAccountQuery2);
  //   });
  // });

  describe('find', () => {
    it('normal case', async () => {
      expect.assertions(6);

      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<VeauAccount,
        DataSourceError | VeauAccountError> = await veauAccountQuery.find().terminate();

      expect(stub.withArgs('/api/accounts').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const veauAccount: VeauAccount = schrodinger.get();

      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getLanguageID().get().get()).toBe(json.languageID);
      expect(veauAccount.getRegionID().get().get()).toBe(json.regionID);
      expect(veauAccount.getAccountName().get()).toBe(json.name);
    });

    it('returns Dead when it has wrong format veauAccountID', async () => {
      expect.assertions(2);

      const json: VeauAccountJSON = {
        veauAccountID: 'malformat uuid',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<VeauAccount, DataSourceError | VeauAccountError> = await veauAccountQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(VeauAccountError);
    });

    it('does not return OK', async () => {
      expect.assertions(2);

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {}
      });

      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<VeauAccount,
        DataSourceError | VeauAccountError> = await veauAccountQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });

  describe('findByEntranceInfo', () => {
    it('normal case', async () => {
      expect.assertions(6);

      const json: VeauAccountJSON = {
        veauAccountID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const info: MockEntranceInformation = new MockEntranceInformation({
        account: AccountName.of('name'),
        password: new MockPassword('password')
      });
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<VeauAccount,
        DataSourceError | VeauAccountError> = await veauAccountQuery.findByEntranceInfo(info).terminate();

      expect(stub.withArgs('/api/auth', {
        account: 'name',
        password: 'password'
      }).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const veauAccount: VeauAccount = schrodinger.get();

      expect(veauAccount.getVeauAccountID().get().get()).toBe(json.veauAccountID);
      expect(veauAccount.getLanguageID().get().get()).toBe(json.languageID);
      expect(veauAccount.getRegionID().get().get()).toBe(json.regionID);
      expect(veauAccount.getAccountName().get()).toBe(json.name);
    });

    it('returns Dead when it has wrong format veauAccountID', async () => {
      expect.assertions(2);

      const json: VeauAccountJSON = {
        veauAccountID: 'malformat uuid',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'name'
      };

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const info: MockEntranceInformation = new MockEntranceInformation();
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<VeauAccount,
        DataSourceError | VeauAccountError> = await veauAccountQuery.findByEntranceInfo(info).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(VeauAccountError);
    });

    it('returns UNAUTHORIZED', async () => {
      expect.assertions(2);

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: StatusCodes.UNAUTHORIZED,
        body: {}
      });

      const info: MockEntranceInformation = new MockEntranceInformation();
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<VeauAccount, DataSourceError | VeauAccountError> = await veauAccountQuery.findByEntranceInfo(info).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('does not return OK nor UNAUTHORIZED', async () => {
      expect.assertions(2);

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: StatusCodes.HTTP_VERSION_NOT_SUPPORTED,
        body: {}
      });

      const info: MockEntranceInformation = new MockEntranceInformation();
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<VeauAccount, DataSourceError | VeauAccountError> = await veauAccountQuery.findByEntranceInfo(info).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });
});

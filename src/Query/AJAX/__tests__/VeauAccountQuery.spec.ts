import 'reflect-metadata';

import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import sinon, { SinonStub } from 'sinon';

import { AJAXError, MockAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockAccountName } from '../../../VO/Account/Mock/MockAccountName';
import {
    MockEntranceInformation
} from '../../../VO/EntranceInformation/Mock/MockEntranceInformation';
import { MockPassword } from '../../../VO/EntranceInformation/Mock/MockPassword';
import { VeauAccountError } from '../../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount, VeauAccountJSON } from '../../../VO/VeauAccount/VeauAccount';
import { VeauAccountQuery } from '../VeauAccountQuery';

describe('VeauAccountQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const veauAccountQuery1: VeauAccountQuery = vault.get<VeauAccountQuery>(Type.VeauAccountAJAXQuery);
      const veauAccountQuery2: VeauAccountQuery = vault.get<VeauAccountQuery>(Type.VeauAccountAJAXQuery);

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
      const schrodinger: Schrodinger<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.find().terminate();

      expect(stub.withArgs('/api/accounts').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const veauAccount: VeauAccount = schrodinger.get();

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

      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(VeauAccountError);
    });

    it('does not return OK', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });

      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(DataSourceError);
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
      const schrodinger: Schrodinger<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.findByEntranceInfo(info).terminate();

      expect(
        stub.withArgs('/api/auth', {
          account: 'name',
          password: 'password'
        }).called
      ).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const veauAccount: VeauAccount = schrodinger.get();

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

      const info: MockEntranceInformation = new MockEntranceInformation();
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.findByEntranceInfo(info).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(VeauAccountError);
    });

    it('returns UNAUTHORIZED', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: UNAUTHORIZED,
        body: {}
      });

      const info: MockEntranceInformation = new MockEntranceInformation();
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.findByEntranceInfo(info).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(DataSourceError);
    });

    it('does not return OK nor UNAUTHORIZED', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });

      const info: MockEntranceInformation = new MockEntranceInformation();
      const veauAccountQuery: VeauAccountQuery = new VeauAccountQuery(ajax);
      const schrodinger: Schrodinger<
        VeauAccount,
        VeauAccountError | DataSourceError
      > = await veauAccountQuery.findByEntranceInfo(info).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });
  });
});

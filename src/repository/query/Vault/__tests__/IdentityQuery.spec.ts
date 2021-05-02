import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError } from '@jamashita/catacombe-fetch';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../../container/Types';
import { vault } from '../../../../container/Vault';
import { AccountName } from '../../../../domain/vo/Account/AccountName';
import { MockEntranceInformation } from '../../../../domain/vo/EntranceInformation/Mock/MockEntranceInformation';
import { IdentityError } from '../../../../domain/vo/Identity/Error/IdentityError';
import { Identity } from '../../../../domain/vo/Identity/Identity';
import { LanguageError } from '../../../../domain/vo/Language/Error/LanguageError';
import { Language } from '../../../../domain/vo/Language/Language';
import { MockLanguage } from '../../../../domain/vo/Language/Mock/MockLanguage';
import { RegionError } from '../../../../domain/vo/Region/Error/RegionError';
import { MockRegion } from '../../../../domain/vo/Region/Mock/MockRegion';
import { Region } from '../../../../domain/vo/Region/Region';
import { VeauAccountError } from '../../../../domain/vo/VeauAccount/Error/VeauAccountError';
import { MockVeauAccount } from '../../../../domain/vo/VeauAccount/Mock/MockVeauAccount';
import { MockVeauAccountID } from '../../../../domain/vo/VeauAccount/Mock/MockVeauAccountID';
import { VeauAccount } from '../../../../domain/vo/VeauAccount/VeauAccount';
import { MockLanguageQuery } from '../../Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Mock/MockRegionQuery';
import { MockVeauAccountQuery } from '../../Mock/MockVeauAccountQuery';
import { IdentityQuery } from '../IdentityQuery';

describe('IdentityQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const identityQuery1: IdentityQuery = vault.get<IdentityQuery>(Type.IdentityVaultQuery);
      const identityQuery2: IdentityQuery = vault.get<IdentityQuery>(Type.IdentityVaultQuery);

      expect(identityQuery1).toBeInstanceOf(IdentityQuery);
      expect(identityQuery1).toBe(identityQuery2);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      expect.assertions(5);

      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const account: AccountName = AccountName.empty();
      const veauAccount: MockVeauAccount = new MockVeauAccount({
        veauAccountID,
        account
      });
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.alive<Region, DataSourceError>(region, DataSourceError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const identity: Identity = schrodinger.get();

      expect(identity.getVeauAccountID()).toBe(veauAccountID);
      expect(identity.getAccountName()).toBe(account);
      expect(identity.getLanguage()).toBe(language);
      expect(identity.getRegion()).toBe(region);
    });

    it('returns Dead when VeauAccountQuery returns Dead VeauAccountError', async () => {
      expect.assertions(2);

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.dead<VeauAccount, VeauAccountError>(new VeauAccountError('test failed'), VeauAccountError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when VeauAccountQuery returns Dead FetchError', async () => {
      expect.assertions(2);

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.dead<VeauAccount, FetchError>(new FetchError('test failed'), FetchError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead when LanguageQuery returns Dead LanguageError', async () => {
      expect.assertions(2);

      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.dead<Language, LanguageError>(new LanguageError('test failed'), LanguageError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.alive<Region, DataSourceError>(region, DataSourceError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when LanguageQuery returns Dead FetchError', async () => {
      expect.assertions(2);

      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.dead<Language, FetchError>(new FetchError('test failed'), FetchError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.alive<Region, DataSourceError>(region, DataSourceError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead when RegionQuery returns Dead RegionError', async () => {
      expect.assertions(2);

      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const language: MockLanguage = new MockLanguage();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.dead<Region, RegionError>(new RegionError('test failed'), RegionError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when RegionQuery returns Dead FetchError', async () => {
      expect.assertions(2);

      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const language: MockLanguage = new MockLanguage();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.dead<Region, FetchError>(new FetchError('test failed'), FetchError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });

  describe('findByEntranceInfo', () => {
    it('normal case', async () => {
      expect.assertions(5);

      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const account: AccountName = AccountName.empty();
      const veauAccount: MockVeauAccount = new MockVeauAccount({
        veauAccountID,
        account
      });
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.alive<Region, DataSourceError>(region, DataSourceError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const identity: Identity = schrodinger.get();

      expect(identity.getVeauAccountID()).toBe(veauAccountID);
      expect(identity.getAccountName()).toBe(account);
      expect(identity.getLanguage()).toBe(language);
      expect(identity.getRegion()).toBe(region);
    });

    it('returns Dead when VeauAccountQuery returns Dead VeauAccountError', async () => {
      expect.assertions(2);

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.dead<VeauAccount, VeauAccountError>(new VeauAccountError('test failed'), VeauAccountError));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when VeauAccountQuery returns Dead FetchError', async () => {
      expect.assertions(2);

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.dead<VeauAccount, FetchError>(new FetchError('test failed'), FetchError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead when LanguageQuery returns Dead LanguageError', async () => {
      expect.assertions(2);

      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.dead<Language, LanguageError>(new LanguageError('test failed'), LanguageError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.alive<Region, DataSourceError>(region, DataSourceError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when LanguageQuery returns Dead FetchError', async () => {
      expect.assertions(2);

      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.dead<Language, FetchError>(new FetchError('test failed'), FetchError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.alive<Region, DataSourceError>(region, DataSourceError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead when RegionQuery returns Dead RegionError', async () => {
      expect.assertions(2);

      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const language: MockLanguage = new MockLanguage();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.dead<Region, RegionError>(new RegionError('test failed'), RegionError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when RegionQuery returns Dead FetchError', async () => {
      expect.assertions(2);

      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const language: MockLanguage = new MockLanguage();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.alive<VeauAccount, DataSourceError>(veauAccount, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageQuery.find = stub2;
      stub2.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));

      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();

      regionQuery.find = stub3;
      stub3.returns(Superposition.dead<Region, FetchError>(new FetchError('test failed'), FetchError));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });
});

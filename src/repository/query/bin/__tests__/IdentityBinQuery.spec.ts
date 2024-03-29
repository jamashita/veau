import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError } from '@jamashita/catacombe-fetch';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { bin } from '../../../../container/Bin';
import { Type } from '../../../../container/Types';
import { AccountName } from '../../../../domain/vo/Account/AccountName';
import { MockEntranceInformation } from '../../../../domain/vo/EntranceInformation/mock/MockEntranceInformation';
import { IdentityError } from '../../../../domain/vo/Identity/error/IdentityError';
import { Identity } from '../../../../domain/vo/Identity/Identity';
import { LanguageError } from '../../../../domain/vo/Language/error/LanguageError';
import { Language } from '../../../../domain/vo/Language/Language';
import { MockLanguage } from '../../../../domain/vo/Language/mock/MockLanguage';
import { RegionError } from '../../../../domain/vo/Region/error/RegionError';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion';
import { Region } from '../../../../domain/vo/Region/Region';
import { VeauAccountError } from '../../../../domain/vo/VeauAccount/error/VeauAccountError';
import { MockVeauAccount } from '../../../../domain/vo/VeauAccount/mock/MockVeauAccount';
import { MockVeauAccountID } from '../../../../domain/vo/VeauAccount/mock/MockVeauAccountID';
import { VeauAccount } from '../../../../domain/vo/VeauAccount/VeauAccount';
import { MockLanguageQuery } from '../../mock/MockLanguageQuery';
import { MockRegionQuery } from '../../mock/MockRegionQuery';
import { MockVeauAccountQuery } from '../../mock/MockVeauAccountQuery';
import { IdentityBinQuery } from '../IdentityBinQuery';

describe('IdentityBinQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const identityQuery1: IdentityBinQuery = bin.get<IdentityBinQuery>(Type.IdentityBinQuery);
      const identityQuery2: IdentityBinQuery = bin.get<IdentityBinQuery>(Type.IdentityBinQuery);

      expect(identityQuery1).toBeInstanceOf(IdentityBinQuery);
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const identity: Identity = schrodinger.get();

      expect(identity.getVeauAccountID()).toBe(veauAccountID);
      expect(identity.getAccountName()).toBe(account);
      expect(identity.getLanguage()).toBe(language);
      expect(identity.getRegion()).toBe(region);
    });

    it('returns Dead when VeauAccountFetchQuery returns Dead VeauAccountError', async () => {
      expect.assertions(2);

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.dead<VeauAccount, VeauAccountError>(new VeauAccountError('test failed'), VeauAccountError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when VeauAccountFetchQuery returns Dead FetchError', async () => {
      expect.assertions(2);

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.find = stub1;
      stub1.returns(Superposition.dead<VeauAccount, FetchError>(new FetchError('test failed'), FetchError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead when LanguageBinQuery returns Dead LanguageError', async () => {
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when LanguageBinQuery returns Dead FetchError', async () => {
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead when RegionBinQuery returns Dead RegionError', async () => {
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.find().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when RegionBinQuery returns Dead FetchError', async () => {
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const identity: Identity = schrodinger.get();

      expect(identity.getVeauAccountID()).toBe(veauAccountID);
      expect(identity.getAccountName()).toBe(account);
      expect(identity.getLanguage()).toBe(language);
      expect(identity.getRegion()).toBe(region);
    });

    it('returns Dead when VeauAccountFetchQuery returns Dead VeauAccountError', async () => {
      expect.assertions(2);

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.dead<VeauAccount, VeauAccountError>(new VeauAccountError('test failed'), VeauAccountError));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when VeauAccountFetchQuery returns Dead FetchError', async () => {
      expect.assertions(2);

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();

      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.returns(Superposition.dead<VeauAccount, FetchError>(new FetchError('test failed'), FetchError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead when LanguageBinQuery returns Dead LanguageError', async () => {
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when LanguageBinQuery returns Dead FetchError', async () => {
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead when RegionBinQuery returns Dead RegionError', async () => {
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(IdentityError);
    });

    it('returns Dead when RegionBinQuery returns Dead FetchError', async () => {
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

      const identityQuery: IdentityBinQuery = new IdentityBinQuery(veauAccountQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Identity, DataSourceError | IdentityError> = await identityQuery.findByEntranceInfo(new MockEntranceInformation()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });
});

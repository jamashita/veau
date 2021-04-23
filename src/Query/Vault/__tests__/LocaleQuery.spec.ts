import { FetchError } from '@jamashita/catacombe-fetch';
import { HeapError } from '@jamashita/catacombe-heap';
import { DataSourceError } from '@jamashita/anden-error';
import { Schrodinger, Superposition } from '@jamashita/genitore-superposition';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { MockLocaleCommand } from '../../../Command/Mock/MockLocaleCommand';
import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { LocaleError } from '../../../VO/Locale/Error/LocaleError';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleVaultQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleVaultQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('returns Alive because Cache has', async () => {
      expect.assertions(5);

      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeFetchQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeFetchQuery.all = stub2;

      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;

      const localeQuery: LocaleQuery = new LocaleQuery(localeFetchQuery, localeCacheQuery, localeCommand);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(false);
      expect(stub3.called).toBe(false);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale);
    });

    it('returns Alive because Fetch has', async () => {
      expect.assertions(5);

      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeFetchQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.returns(Superposition.dead<Locale, HeapError>(new HeapError('test failed'), HeapError));

      const stub2: SinonStub = sinon.stub();

      localeFetchQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const localeQuery: LocaleQuery = new LocaleQuery(localeFetchQuery, localeCacheQuery, localeCommand);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale);
    });

    it('returns Dead Cache nor Fetch returned nothing', async () => {
      expect.assertions(5);

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeFetchQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.returns(Superposition.dead<Locale, HeapError>(new HeapError('test failed'), HeapError));

      const stub2: SinonStub = sinon.stub();

      localeFetchQuery.all = stub2;
      stub2.returns(Superposition.dead<Locale, FetchError>(new FetchError('test failed', 500), FetchError));

      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;

      const localeQuery: LocaleQuery = new LocaleQuery(localeFetchQuery, localeCacheQuery, localeCommand);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(false);
      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('returns Dead Cache because saving Cache failure', async () => {
      expect.assertions(5);

      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeFetchQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.returns(Superposition.dead<Locale, HeapError>(new HeapError('test failed'), HeapError));

      const stub2: SinonStub = sinon.stub();

      localeFetchQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;
      stub3.returns(Superposition.dead<Locale, HeapError>(new HeapError('test failed'), HeapError));

      const localeQuery: LocaleQuery = new LocaleQuery(localeFetchQuery, localeCacheQuery, localeCommand);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(HeapError);
    });
  });
});

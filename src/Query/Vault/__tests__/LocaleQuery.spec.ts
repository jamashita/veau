import { AJAXError } from '@jamashita/publikum-ajax';
import { CacheError } from '@jamashita/publikum-cache';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
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
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleVaultQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleVaultQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('returns Alive because Cache has', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeAJAXQuery.all = stub2;

      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeQuery.all().terminate();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(false);
      expect(stub3.called).toBe(false);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale);
    });

    it('returns Alive because AJAX has', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.returns(Superposition.dead<Locale, CacheError>(new CacheError('test failed'), CacheError));

      const stub2: SinonStub = sinon.stub();

      localeAJAXQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeQuery.all().terminate();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale);
    });

    it('returns Dead Cache nor AJAX returned nothing', async () => {
      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.returns(Superposition.dead<Locale, CacheError>(new CacheError('test failed'), CacheError));

      const stub2: SinonStub = sinon.stub();

      localeAJAXQuery.all = stub2;
      stub2.returns(Superposition.dead<Locale, AJAXError>(new AJAXError('test failed', 500), AJAXError));

      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeQuery.all().terminate();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(false);
      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });

    it('returns Dead Cache because saving Cache failure', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.returns(Superposition.dead<Locale, CacheError>(new CacheError('test failed'), CacheError));

      const stub2: SinonStub = sinon.stub();

      localeAJAXQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;
      stub3.returns(Superposition.dead<Locale, CacheError>(new CacheError('test failed'), CacheError));

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeQuery.all().terminate();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(CacheError);
    });
  });
});

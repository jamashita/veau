import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { CacheError } from '../../../General/Cache/CacheError';
import { MockCache } from '../../../General/Cache/Mock/MockCache';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/Mock/MockError';
import { Superposition } from '../../../General/Superposition/Superposition';
import { VAULT_LOCALE_KEY } from '../../../Infrastructure/VeauCache';
import { Locale } from '../../../VO/Locale';
import { MockLocale } from '../../../VO/Mock/MockLocale';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleCacheQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleCacheQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const locale: MockLocale = new MockLocale();

      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();
      cache.get = stub;
      stub.returns(locale);

      const localeQuery: LocaleQuery = new LocaleQuery(cache);
      const superposition: Superposition<Locale, DataSourceError> = await localeQuery.all();

      expect(stub.withArgs(VAULT_LOCALE_KEY).called).toBe(true);
      expect(superposition.isSuccess()).toBe(true);
      expect(superposition.get()).toBe(locale);
    });

    it('returns Failure when Cache throws CacheError', async () => {
      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();
      cache.get = stub;
      stub.throws(new CacheError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(cache);
      const superposition: Superposition<Locale, DataSourceError> = await localeQuery.all();

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(CacheError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();
      cache.get = stub;
      stub.throws(new MockError());

      const localeQuery: LocaleQuery = new LocaleQuery(cache);
      await expect(localeQuery.all()).rejects.toThrow(MockError);
    });
  });
});

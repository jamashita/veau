import { CacheError, MockHeap } from '@jamashita/catacombe-heap';
import { DataSourceError } from '@jamashita/anden-error';
import { Schrodinger } from '@jamashita/genitore-superposition';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { VAULT_LOCALE_KEY } from '../../../Infrastructure/VeauCache';
import { LocaleError } from '../../../VO/Locale/Error/LocaleError';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleCacheQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleCacheQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(3);

      const locale: MockLocale = new MockLocale();

      const cache: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();

      cache.get = stub;
      stub.returns(locale);

      const localeQuery: LocaleQuery = new LocaleQuery(cache);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(stub.withArgs(VAULT_LOCALE_KEY).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale);
    });

    it('returns Dead when Cache throws CacheError', async () => {
      expect.assertions(2);

      const cache: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();

      cache.get = stub;
      stub.throws(new CacheError('test failed'));

      const localeQuery: LocaleQuery = new LocaleQuery(cache);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(CacheError);
    });
  });
});

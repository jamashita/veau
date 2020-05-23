import 'reflect-metadata';

import { CacheError, DataSourceError, MockCache, Superposition } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

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
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleCacheQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleCacheQuery);

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
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeQuery.all();

      expect(stub.withArgs(VAULT_LOCALE_KEY).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(locale);
    });

    it('returns Dead when Cache throws CacheError', async () => {
      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();

      cache.get = stub;
      stub.throws(new CacheError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(cache);
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LocaleError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(CacheError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});

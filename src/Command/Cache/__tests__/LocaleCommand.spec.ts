import 'reflect-metadata';

import sinon, { SinonSpy, SinonStub } from 'sinon';

import { CacheError, MockCache } from '@jamashita/publikum-cache';
import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { VAULT_LOCALE_KEY } from '../../../Infrastructure/VeauCache';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { LocaleCommand } from '../LocaleCommand';

describe('LocaleCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeCommand1: LocaleCommand = vault.get<LocaleCommand>(Type.LocaleCacheCommand);
      const localeCommand2: LocaleCommand = vault.get<LocaleCommand>(Type.LocaleCacheCommand);

      expect(localeCommand1).toBeInstanceOf(LocaleCommand);
      expect(localeCommand1).toBe(localeCommand2);
    });
  });

  describe('create', () => {
    it('normal case', async () => {
      const locale: Locale = new MockLocale();

      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();

      cache.set = stub;
      stub.returns(locale);

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      const superposition: Superposition<unknown, DataSourceError> = await localeCommand.create(locale);

      expect(stub.withArgs(VAULT_LOCALE_KEY, locale).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead when Cache throws CacheError', async () => {
      const locale: Locale = new MockLocale();

      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();

      cache.set = stub;
      stub.throws(new CacheError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      const superposition: Superposition<unknown, DataSourceError> = await localeCommand.create(locale);

      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(CacheError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});

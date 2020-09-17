import { CacheError, MockCache } from '@jamashita/publikum-cache';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { VAULT_LOCALE_KEY } from '../../../Infrastructure/VeauCache';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { LocaleCommand } from '../LocaleCommand';

describe('LocaleCommand', () => {
  // TPDP
  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('container', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  //   it('must be a singleton', () => {
  //     const localeCommand1: LocaleCommand = v.get<LocaleCommand>(Type.LocaleCacheCommand);
  //     const localeCommand2: LocaleCommand = v.get<LocaleCommand>(Type.LocaleCacheCommand);
  //
  //     expect(localeCommand1).toBeInstanceOf(LocaleCommand);
  //     expect(localeCommand1).toBe(localeCommand2);
  //   });
  // });

  describe('create', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const locale: Locale = new MockLocale();

      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();

      cache.set = stub;
      stub.returns(locale);

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await localeCommand.create(locale).terminate();

      expect(stub.withArgs(VAULT_LOCALE_KEY, locale).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead when Cache throws CacheError', async () => {
      expect.assertions(2);

      const locale: Locale = new MockLocale();

      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();

      cache.set = stub;
      stub.throws(new CacheError('test failed'));

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await localeCommand.create(locale).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(CacheError);
    });
  });
});

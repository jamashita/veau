import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { CacheError } from '../../../General/Cache/CacheError';
import { MockCache } from '../../../General/Cache/Mock/MockCache';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/Mock/MockError';
import { Try } from '../../../General/Try/Try';
import { VAULT_LOCALE_KEY } from '../../../Infrastructure/VeauCache';
import { Locale } from '../../../VO/Locale';
import { MockLocale } from '../../../VO/Mock/MockLocale';
import { LocaleCommand } from '../LocaleCommand';

// DONE
describe('LocaleCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeCommand1: LocaleCommand = vault.get<LocaleCommand>(TYPE.LocaleCacheCommand);
      const localeCommand2: LocaleCommand = vault.get<LocaleCommand>(TYPE.LocaleCacheCommand);

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
      const trial: Try<void, DataSourceError> = await localeCommand.create(locale);

      expect(stub.withArgs(VAULT_LOCALE_KEY, locale).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure when Cache throws CacheError', async () => {
      const locale: Locale = new MockLocale();

      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();
      cache.set = stub;
      stub.throws(new CacheError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      const trial: Try<void, DataSourceError> = await localeCommand.create(locale);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(CacheError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when Cache throws CacheError', async () => {
      const locale: Locale = new MockLocale();

      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();
      cache.set = stub;
      stub.throws(new MockError());

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      await expect(localeCommand.create(locale)).rejects.toThrow(MockError);
    });
  });
});

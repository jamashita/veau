import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../Container/Vault';
import { TYPE } from '../../../Container/Types';
import { DataSourceError } from '../../../General/DataSourceError';
import { CacheError } from '../../../General/Cache/CacheError';
import { MockCache } from '../../../General/Cache/Mock/MockCache';
import { MockError } from '../../../General/MockError';
import { Try } from '../../../General/Try/Try';
import { VAULT_LOCALE_KEY } from '../../../Infrastructure/VeauCache';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Languages } from '../../../VO/Languages';
import { Locale } from '../../../VO/Locale';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { Regions } from '../../../VO/Regions';
import { LocaleCommand } from '../LocaleCommand';

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
      const locale: Locale = Locale.of(Languages.ofArray([
        Language.of(
          LanguageID.of(1),
          LanguageName.of('language'),
          LanguageName.of('english language'),
          ISO639.of('aa')
        )
      ]), Regions.ofArray([
        Region.of(
          RegionID.of(2),
          RegionName.of('region'),
          ISO3166.of('bb')
        )
      ]));

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
      const locale: Locale = Locale.of(Languages.ofArray([
        Language.of(
          LanguageID.of(1),
          LanguageName.of('language'),
          LanguageName.of('english language'),
          ISO639.of('aa')
        )
      ]), Regions.ofArray([
        Region.of(
          RegionID.of(2),
          RegionName.of('region'),
          ISO3166.of('bb')
        )
      ]));

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
      const locale: Locale = Locale.of(Languages.ofArray([
        Language.of(
          LanguageID.of(1),
          LanguageName.of('language'),
          LanguageName.of('english language'),
          ISO639.of('aa')
        )
      ]), Regions.ofArray([
        Region.of(
          RegionID.of(2),
          RegionName.of('region'),
          ISO3166.of('bb')
        )
      ]));

      const cache: MockCache = new MockCache();
      const stub: SinonStub = sinon.stub();
      cache.set = stub;
      stub.throws( new MockError());

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      await expect(localeCommand.create(locale)).rejects.toThrow(MockError);
    });
  });
});

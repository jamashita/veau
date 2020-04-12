import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { HeapError } from '../../../veau-general/Heap/HeapError';
import { MockHeap } from '../../../veau-general/Heap/Mock/MockHeap';
import { MockError } from '../../../veau-general/MockError';
import { Try } from '../../../veau-general/Try/Try';
import { VAULT_LOCALE_KEY } from '../../../veau-infrastructure/VeauVault';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Languages } from '../../../veau-vo/Languages';
import { Locale } from '../../../veau-vo/Locale';
import { Region } from '../../../veau-vo/Region';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { Regions } from '../../../veau-vo/Regions';
import { LocaleCommand } from '../LocaleCommand';

describe('LocaleCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeCommand1: LocaleCommand = vault.get<LocaleCommand>(TYPE.LocaleHeapCommand);
      const localeCommand2: LocaleCommand = vault.get<LocaleCommand>(TYPE.LocaleHeapCommand);

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

      const heap: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();
      heap.set = stub;
      stub.returns(locale);

      const localeCommand: LocaleCommand = new LocaleCommand(heap);
      const trial: Try<void, DataSourceError> = await localeCommand.create(locale);

      expect(stub.withArgs(VAULT_LOCALE_KEY, locale).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure when Heap throws HeapError', async () => {
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

      const heap: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();
      heap.set = stub;
      stub.throws(new HeapError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeCommand: LocaleCommand = new LocaleCommand(heap);
      const trial: Try<void, DataSourceError> = await localeCommand.create(locale);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(HeapError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when Heap throws HeapError', async () => {
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

      const heap: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();
      heap.set = stub;
      stub.throws( new MockError());

      const localeCommand: LocaleCommand = new LocaleCommand(heap);
      await expect(localeCommand.create(locale)).rejects.toThrow(MockError);
    });
  });
});

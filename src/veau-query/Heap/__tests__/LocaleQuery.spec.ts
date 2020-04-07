import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { HeapError } from '../../../veau-general/Heap/HeapError';
import { MockHeap } from '../../../veau-general/Heap/mocks/MockHeap';
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
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleHeapQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleHeapQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const locale: Locale = Locale.of(Languages.of([
        Language.of(
          LanguageID.of(1),
          LanguageName.of('language'),
          LanguageName.of('english language'),
          ISO639.of('aa')
        )
      ]), Regions.of([
        Region.of(
          RegionID.of(2),
          RegionName.of('region'),
          ISO3166.of('bb')
        )
      ]));

      const heap: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();
      heap.get = stub;
      stub.returns(locale);

      const localeQuery: LocaleQuery = new LocaleQuery(heap);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub.withArgs(VAULT_LOCALE_KEY).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const loc: Locale = trial.get();
      expect(loc.getLanguages().size()).toEqual(1);
      for (let i: number = 0; i < loc.getLanguages().size(); i++) {
        const language: Language = loc.getLanguages().get(i).get();
        expect(language.getLanguageID()).toEqual(locale.getLanguages().get(i).get().getLanguageID());
        expect(language.getName()).toEqual(locale.getLanguages().get(i).get().getName());
        expect(language.getEnglishName()).toEqual(locale.getLanguages().get(i).get().getEnglishName());
        expect(language.getISO639()).toEqual(locale.getLanguages().get(i).get().getISO639());
      }
      expect(loc.getRegions().size()).toEqual(1);
      for (let i: number = 0; i < loc.getRegions().size(); i++) {
        const region: Region = loc.getRegions().get(i).get();
        expect(region.getRegionID()).toEqual(locale.getRegions().get(i).get().getRegionID());
        expect(region.getName()).toEqual(locale.getRegions().get(i).get().getName());
        expect(region.getISO3166()).toEqual(locale.getRegions().get(i).get().getISO3166());
      }
    });

    it('returns Failure when Heap throws HeapError', async () => {
      const heap: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();
      heap.get = stub;
      stub.throws(new HeapError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(heap);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

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

    it('throws Error', async () => {
      const error: Error = new Error();

      const heap: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();
      heap.get = stub;
      stub.throws(error);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(heap);
      try {
        await localeQuery.all();
        spy1();
      }
      catch (err) {
        spy2();
        expect(err).toBe(error);
      }

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});

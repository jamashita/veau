import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockLocaleCommand } from '../../../Command/Mock/MockLocaleCommand';
import { vault } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { AJAXError } from '../../../veau-general/AJAX/AJAXError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { HeapError } from '../../../veau-general/Heap/HeapError';
import { Failure } from '../../../veau-general/Try/Failure';
import { Success } from '../../../veau-general/Try/Success';
import { Try } from '../../../veau-general/Try/Try';
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
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleVaultQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleVaultQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('returns Success because Heap has', async () => {
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

      const localeHeapQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();
      localeHeapQuery.all = stub1;
      stub1.resolves(Success.of<Locale, DataSourceError>(locale));
      const stub2: SinonStub = sinon.stub();
      localeAJAXQuery.all = stub2;
      const stub3: SinonStub = sinon.stub();
      localeCommand.create = stub3;

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeHeapQuery, localeCommand);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(false);
      expect(stub3.called).toEqual(false);
      expect(trial.isSuccess()).toEqual(true);
      const loc: Locale = trial.get();
      expect(loc).toEqual(locale);
    });

    it('returns Success because AJAX has', async () => {
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

      const localeHeapQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();
      localeHeapQuery.all = stub1;
      stub1.resolves(Failure.of<Locale, DataSourceError>(new HeapError('test failed')));
      const stub2: SinonStub = sinon.stub();
      localeAJAXQuery.all = stub2;
      stub2.resolves(Success.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();
      localeCommand.create = stub3;
      stub3.resolves(Success.of<DataSourceError>());

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeHeapQuery, localeCommand);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const loc: Locale = trial.get();
      expect(loc).toEqual(locale);
    });

    it('returns Failure Heap nor AJAX returned nothing', async () => {
      const localeHeapQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();
      localeHeapQuery.all = stub1;
      stub1.resolves(Failure.of<Locale, DataSourceError>(new HeapError('test failed')));
      const stub2: SinonStub = sinon.stub();
      localeAJAXQuery.all = stub2;
      stub2.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed')));
      const stub3: SinonStub = sinon.stub();
      localeCommand.create = stub3;
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeHeapQuery, localeCommand);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(false);
      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure Heap nor AJAX returned nothing', async () => {
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

      const localeHeapQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();
      localeHeapQuery.all = stub1;
      stub1.resolves(Failure.of<Locale, DataSourceError>(new HeapError('test failed')));
      const stub2: SinonStub = sinon.stub();
      localeAJAXQuery.all = stub2;
      stub2.resolves(Success.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();
      localeCommand.create = stub3;
      stub3.resolves(Failure.of<Locale, DataSourceError>(new HeapError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeHeapQuery, localeCommand);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
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
  });
});

import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/Redis/LanguageCommand';
import { RegionCommand } from '../../veau-command/Redis/RegionCommand';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { LanguageQuery } from '../../veau-query/LanguageQuery';
import { RegionQuery } from '../../veau-query/RegionQuery';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Languages } from '../../veau-vo/Languages';
import { Locale } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { Regions } from '../../veau-vo/Regions';
import { LocaleInteractor } from '../LocaleInteractor';

describe('LocaleInteractor',  () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeInteractor1: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const localeInteractor2: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);

      expect(localeInteractor1).toBeInstanceOf(LocaleInteractor);
      expect(localeInteractor1).toBe(localeInteractor2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);
      const regions: Regions = Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const stub1: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub1;
      stub1.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const stub2: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(regions));

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<Locale, NoSuchElementError> = await localeInteractor.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get().getLanguages().equals(languages)).toEqual(true);
      expect(trial.get().getRegions().equals(regions)).toEqual(true);
    });

    it('LanguageQuery.all returns Failure', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub1;
      stub1.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const stub2: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ])));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<Locale, NoSuchElementError> = await localeInteractor.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('RegionQuery.all returns Failure', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub1;
      stub1.resolves(Success.of<Languages, NoSuchElementError>(Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ])));
      const stub2: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub2;
      stub2.resolves(Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<Locale, NoSuchElementError> = await localeInteractor.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageCommand.prototype.deleteAll = stub1;
      stub1.resolves(Success.of<void, CacheError>(undefined));
      const stub2: SinonStub = sinon.stub();
      RegionCommand.prototype.deleteAll = stub2;
      stub2.resolves(Success.of<void, CacheError>(undefined));

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<void, CacheError | DataSourceError> = await localeInteractor.delete();

      expect(trial.isSuccess()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
    });

    it('LanguageCommand.deleteAll returns Failure', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageCommand.prototype.deleteAll = stub1;
      stub1.resolves(Failure.of<void, CacheError>(new CacheError('test failed')));
      const stub2: SinonStub = sinon.stub();
      RegionCommand.prototype.deleteAll = stub2;
      stub2.resolves(Success.of<void, CacheError>(undefined));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<void, CacheError | DataSourceError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(CacheError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('RegionCommand.deleteAll returns Failure', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageCommand.prototype.deleteAll = stub1;
      stub1.resolves(Success.of<void, CacheError>(undefined));
      const stub2: SinonStub = sinon.stub();
      RegionCommand.prototype.deleteAll = stub2;
      stub2.resolves(Failure.of<void, CacheError>(new CacheError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<void, CacheError | DataSourceError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(CacheError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});

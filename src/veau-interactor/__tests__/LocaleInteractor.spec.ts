import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockLanguageCommand } from '../../veau-command/Mock/MockLanguageCommand';
import { MockRegionCommand } from '../../veau-command/Mock/MockRegionCommand';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { MockMySQLError } from '../../veau-general/MySQL/mocks/MockMySQLError';
import { MockRedisError } from '../../veau-general/Redis/MockRedisError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { MockLanguageQuery } from '../../veau-query/Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../veau-query/Mock/MockRegionQuery';
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

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
      const trial: Try<Locale, NoSuchElementError | DataSourceError> = await localeInteractor.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get().getLanguages()).toEqual(languages);
      expect(trial.get().getRegions()).toEqual(regions);
    });

    it('LanguageQuery.all returns Failure by NoSuchElementError', async () => {
      const regions: Regions = Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
      const trial: Try<Locale, NoSuchElementError | DataSourceError> = await localeInteractor.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('LanguageQuery.all returns Failure by DataSourceError', async () => {
      const regions: Regions = Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Failure.of<Languages, DataSourceError>(new MockMySQLError()));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
      const trial: Try<Locale, NoSuchElementError | DataSourceError> = await localeInteractor.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('RegionQuery.all returns Failure by NoSuchElementError', async () => {
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
      const trial: Try<Locale, NoSuchElementError | DataSourceError> = await localeInteractor.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('RegionQuery.all returns Failure by NoSuchElementError', async () => {
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Failure.of<Languages, DataSourceError>(new MockMySQLError()));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
      const trial: Try<Locale, NoSuchElementError | DataSourceError> = await localeInteractor.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Success.of<void, CacheError>(undefined));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Success.of<void, CacheError>(undefined));

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
      const trial: Try<void, CacheError | DataSourceError> = await localeInteractor.delete();

      expect(trial.isSuccess()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
    });

    it('LanguageCommand.deleteAll returns Failure by CacheError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Failure.of<void, CacheError>(new CacheError('test failed')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Success.of<void, CacheError>(undefined));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
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

    it('LanguageCommand.deleteAll returns Failure by DataSourceError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Failure.of<void, DataSourceError>(new MockRedisError()));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Success.of<void, CacheError>(undefined));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
      const trial: Try<void, CacheError | DataSourceError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('RegionCommand.deleteAll returns Failure by CacheError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Success.of<void, CacheError>(undefined));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Failure.of<void, CacheError>(new CacheError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
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

    it('RegionCommand.deleteAll returns Failure by DataSourceError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Success.of<void, CacheError>(undefined));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Failure.of<void, DataSourceError>(new MockRedisError()));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand)
      const trial: Try<void, CacheError | DataSourceError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});

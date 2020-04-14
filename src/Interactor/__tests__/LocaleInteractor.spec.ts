import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockLanguageCommand } from '../../Command/Mock/MockLanguageCommand';
import { MockRegionCommand } from '../../Command/Mock/MockRegionCommand';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { MySQLError } from '../../General/MySQL/MySQLError';
import { RedisError } from '../../General/Redis/RedisError';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { MockLanguageQuery } from '../../Query/Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Query/Mock/MockRegionQuery';
import { ISO3166 } from '../../VO/ISO3166';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { LanguageID } from '../../VO/LanguageID';
import { LanguageName } from '../../VO/LanguageName';
import { Languages } from '../../VO/Languages';
import { Locale } from '../../VO/Locale';
import { Region } from '../../VO/Region';
import { RegionID } from '../../VO/RegionID';
import { RegionName } from '../../VO/RegionName';
import { Regions } from '../../VO/Regions';
import { LocaleInteractor } from '../LocaleInteractor';

describe('LocaleInteractor', () => {
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
      const languages: Languages = Languages.ofArray([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);
      const regions: Regions = Regions.ofArray([
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
      const regions: Regions = Regions.ofArray([
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

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
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
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]);

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Failure.of<Languages, DataSourceError>(new MySQLError('test faied')));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Success.of<Regions, NoSuchElementError>(regions));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
      const trial: Try<Locale, NoSuchElementError | DataSourceError> = await localeInteractor.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('RegionQuery.all returns Failure by NoSuchElementError', async () => {
      const languages: Languages = Languages.ofArray([
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

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
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
      const languages: Languages = Languages.ofArray([
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
      stub2.resolves(Failure.of<Languages, DataSourceError>(new MySQLError('test faied')));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
      const trial: Try<Locale, NoSuchElementError | DataSourceError> = await localeInteractor.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
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
      stub1.resolves(Success.of<DataSourceError>());
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Success.of<DataSourceError>());

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
      const trial: Try<void, DataSourceError> = await localeInteractor.delete();

      expect(trial.isSuccess()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
    });

    it('LanguageCommand.deleteAll returns Failure by DataSourceError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Failure.of<DataSourceError>(new RedisError('test failed')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Success.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
      const trial: Try<void, DataSourceError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
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
      stub1.resolves(Failure.of<DataSourceError>(new RedisError('test faied')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Success.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
      const trial: Try<void, DataSourceError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
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
      stub1.resolves(Success.of<DataSourceError>());
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Failure.of<DataSourceError>(new RedisError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
      const trial: Try<void, DataSourceError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
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
      stub1.resolves(Success.of<DataSourceError>());
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Failure.of<DataSourceError>(new RedisError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(languageKernelQuery, regionKernelQuery, languageRedisCommand, regionRedisCommand);
      const trial: Try<void, DataSourceError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});

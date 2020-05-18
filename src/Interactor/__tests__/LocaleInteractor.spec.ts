import { Alive, DataSourceError, Dead, MySQLError, RedisError, Superposition } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockLanguageCommand } from '../../Command/Mock/MockLanguageCommand';
import { MockRegionCommand } from '../../Command/Mock/MockRegionCommand';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { LanguagesError } from '../../Error/LanguagesError';
import { LocaleError } from '../../Error/LocaleError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionsError } from '../../Error/RegionsError';
import { MockLanguageQuery } from '../../Query/Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Query/Mock/MockRegionQuery';
import { Languages } from '../../VO/Languages';
import { Locale } from '../../VO/Locale';
import { MockLanguages } from '../../VO/Mock/MockLanguages';
import { MockRegions } from '../../VO/Mock/MockRegions';
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
      const languages: MockLanguages = new MockLanguages();
      const regions: MockRegions = new MockRegions();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Alive.of<Languages, NoSuchElementError>(languages));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Alive.of<Regions, NoSuchElementError>(regions));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeInteractor.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get().getLanguages()).toBe(languages);
      expect(superposition.get().getRegions()).toBe(regions);
    });

    it('LanguageQuery.all returns Dead by LanguagesError', async () => {
      const regions: MockRegions = new MockRegions();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Dead.of<Languages, LanguagesError>(new LanguagesError('test failed')));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Alive.of<Regions, NoSuchElementError>(regions));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeInteractor.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LocaleError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(LocaleError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('LanguageQuery.all returns Dead by DataSourceError', async () => {
      const regions: MockRegions = new MockRegions();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Dead.of<Languages, DataSourceError>(new MySQLError('test faied')));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Alive.of<Regions, NoSuchElementError>(regions));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeInteractor.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LocaleError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('RegionQuery.all returns Dead by RegionsError', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Alive.of<Languages, NoSuchElementError>(languages));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Dead.of<Languages, RegionsError>(new RegionsError('test failed')));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeInteractor.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LocaleError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(LocaleError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('RegionQuery.all returns Dead by NoSuchElementError', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageKernelQuery.all = stub1;
      stub1.resolves(Alive.of<Languages, NoSuchElementError>(languages));
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionKernelQuery.all = stub2;
      stub2.resolves(Dead.of<Languages, DataSourceError>(new MySQLError('test faied')));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeInteractor.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LocaleError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Alive.of<DataSourceError>());

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<void, DataSourceError> = await localeInteractor.delete();

      expect(superposition.isAlive()).toBe(true);
      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
    });

    it('LanguageCommand.deleteAll returns Dead by DataSourceError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Dead.of<DataSourceError>(new RedisError('test failed')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Alive.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<void, DataSourceError> = await localeInteractor.delete();

      expect(superposition.isDead()).toBe(true);
      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('LanguageCommand.deleteAll returns Dead by DataSourceError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Dead.of<DataSourceError>(new RedisError('test faied')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Alive.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<void, DataSourceError> = await localeInteractor.delete();

      expect(superposition.isDead()).toBe(true);
      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('RegionCommand.deleteAll returns Dead by DataSourceError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Dead.of<DataSourceError>(new RedisError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<void, DataSourceError> = await localeInteractor.delete();

      expect(superposition.isDead()).toBe(true);
      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('RegionCommand.deleteAll returns Dead by DataSourceError', async () => {
      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();
      languageRedisCommand.deleteAll = stub1;
      stub1.resolves(Alive.of<DataSourceError>());
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();
      regionRedisCommand.deleteAll = stub2;
      stub2.resolves(Dead.of<DataSourceError>(new RedisError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const superposition: Superposition<void, DataSourceError> = await localeInteractor.delete();

      expect(superposition.isDead()).toBe(true);
      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});

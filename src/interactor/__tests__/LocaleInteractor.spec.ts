import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MySQLError } from '@jamashita/catacombe-mysql';
import { RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { MockLanguageCommand } from '../../repository/command/mock/MockLanguageCommand';
import { MockRegionCommand } from '../../repository/command/mock/MockRegionCommand';
import { kernel } from '../../container/Kernel';
import { Type } from '../../container/Types';
import { MockLanguageQuery } from '../../repository/query/Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../repository/query/Mock/MockRegionQuery';
import { LanguageError } from '../../domain/vo/Language/error/LanguageError';
import { Languages } from '../../domain/vo/Language/Languages';
import { LocaleError } from '../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../domain/vo/Locale/Locale';
import { RegionError } from '../../domain/vo/Region/error/RegionError';
import { Regions } from '../../domain/vo/Region/Regions';
import { LocaleInteractor } from '../LocaleInteractor';

describe('LocaleInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const localeInteractor1: LocaleInteractor = kernel.get<LocaleInteractor>(Type.LocaleInteractor);
      const localeInteractor2: LocaleInteractor = kernel.get<LocaleInteractor>(Type.LocaleInteractor);

      expect(localeInteractor1).toBeInstanceOf(LocaleInteractor);
      expect(localeInteractor1).toBe(localeInteractor2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(3);

      const languages: Languages = Languages.empty();
      const regions: Regions = Regions.empty();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();

      const stub1: SinonStub = sinon.stub();

      languageKernelQuery.all = stub1;
      stub1.returns(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));

      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionKernelQuery.all = stub2;
      stub2.returns(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));

      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeInteractor.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().getLanguages()).toBe(languages);
      expect(schrodinger.get().getRegions()).toBe(regions);
    });

    it('languageQuery.all returns Dead by LanguageError', async () => {
      expect.assertions(2);

      const regions: Regions = Regions.empty();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageKernelQuery.all = stub1;
      stub1.returns(Superposition.dead<Languages, LanguageError>(new LanguageError('test failed'), LanguageError));

      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionKernelQuery.all = stub2;
      stub2.returns(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));

      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeInteractor.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LocaleError);
    });

    it('languageQuery.all returns Dead by DataSourceError', async () => {
      expect.assertions(2);

      const regions: Regions = Regions.empty();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageKernelQuery.all = stub1;
      stub1.returns(Superposition.dead<Languages, DataSourceError>(new MySQLError('test faied'), DataSourceError));

      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionKernelQuery.all = stub2;
      stub2.returns(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));

      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeInteractor.all().terminate();
      console.log(schrodinger);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('regionQuery.all returns Dead by RegionError', async () => {
      expect.assertions(2);

      const languages: Languages = Languages.empty();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageKernelQuery.all = stub1;
      stub1.returns(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));

      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionKernelQuery.all = stub2;
      stub2.returns(Superposition.dead<Languages, RegionError>(new RegionError('test failed'), RegionError));

      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeInteractor.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LocaleError);
    });

    it('regionQuery.all returns Dead by NoSuchElementError', async () => {
      expect.assertions(2);

      const languages: Languages = Languages.empty();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageKernelQuery.all = stub1;
      stub1.returns(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));

      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionKernelQuery.all = stub2;
      stub2.returns(Superposition.dead<Languages, DataSourceError>(new MySQLError('test faied'), DataSourceError));

      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeInteractor.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(DataSourceError);
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
      expect.assertions(1);

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();

      languageRedisCommand.deleteAll = stub1;
      stub1.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();

      regionRedisCommand.deleteAll = stub2;
      stub2.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<unknown, DataSourceError> = await localeInteractor.delete().terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('languageCommand.deleteAll returns Dead by DataSourceError', async () => {
      expect.assertions(2);

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();

      languageRedisCommand.deleteAll = stub1;
      stub1.returns(Superposition.dead<unknown, DataSourceError>(new RedisError('test failed'), DataSourceError));

      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();

      regionRedisCommand.deleteAll = stub2;
      stub2.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<unknown, DataSourceError> = await localeInteractor.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(DataSourceError);
    });

    it('regionCommand.deleteAll returns Dead by DataSourceError', async () => {
      expect.assertions(2);

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub1: SinonStub = sinon.stub();

      languageRedisCommand.deleteAll = stub1;
      stub1.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub2: SinonStub = sinon.stub();

      regionRedisCommand.deleteAll = stub2;
      stub2.returns(Superposition.dead<unknown, DataSourceError>(new RedisError('test failed'), DataSourceError));

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<unknown, DataSourceError> = await localeInteractor.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(DataSourceError);
    });
  });
});

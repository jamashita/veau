import 'reflect-metadata';

import sinon, { SinonStub } from 'sinon';

import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { MySQLError } from '@jamashita/publikum-mysql';
import { RedisError } from '@jamashita/publikum-redis';

import { MockLanguageCommand } from '../../Command/Mock/MockLanguageCommand';
import { MockRegionCommand } from '../../Command/Mock/MockRegionCommand';
import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';
import { MockLanguageQuery } from '../../Query/Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Query/Mock/MockRegionQuery';
import { LanguagesError } from '../../VO/Language/Error/LanguagesError';
import { Languages } from '../../VO/Language/Languages';
import { MockLanguages } from '../../VO/Language/Mock/MockLanguages';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
import { MockRegions } from '../../VO/Region/Mock/MockRegions';
import { Regions } from '../../VO/Region/Regions';
import { LocaleInteractor } from '../LocaleInteractor';

describe('LocaleInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeInteractor1: LocaleInteractor = kernel.get<LocaleInteractor>(Type.LocaleInteractor);
      const localeInteractor2: LocaleInteractor = kernel.get<LocaleInteractor>(Type.LocaleInteractor);

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
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeInteractor.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().getLanguages()).toBe(languages);
      expect(schrodinger.get().getRegions()).toBe(regions);
    });

    it('LanguageQuery.all returns Dead by LanguagesError', async () => {
      const regions: MockRegions = new MockRegions();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageKernelQuery.all = stub1;
      stub1.returns(Superposition.dead<Languages, LanguagesError>(new LanguagesError('test failed'), LanguagesError));

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
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeInteractor.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LocaleError);
    });

    it('LanguageQuery.all returns Dead by DataSourceError', async () => {
      const regions: MockRegions = new MockRegions();

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
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeInteractor.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('RegionQuery.all returns Dead by RegionsError', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageKernelQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageKernelQuery.all = stub1;
      stub1.returns(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));

      const regionKernelQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionKernelQuery.all = stub2;
      stub2.returns(Superposition.dead<Languages, RegionsError>(new RegionsError('test failed'), RegionsError));

      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const localeInteractor: LocaleInteractor = new LocaleInteractor(
        languageKernelQuery,
        regionKernelQuery,
        languageRedisCommand,
        regionRedisCommand
      );
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeInteractor.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LocaleError);
    });

    it('RegionQuery.all returns Dead by NoSuchElementError', async () => {
      const languages: MockLanguages = new MockLanguages();

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
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeInteractor.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(DataSourceError);
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
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

    it('LanguageCommand.deleteAll returns Dead by DataSourceError', async () => {
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

    it('RegionCommand.deleteAll returns Dead by DataSourceError', async () => {
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

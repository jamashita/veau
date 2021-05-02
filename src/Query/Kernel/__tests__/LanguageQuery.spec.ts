import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MySQLError } from '@jamashita/catacombe-mysql';
import { RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { MockLanguageCommand } from '../../../Command/Mock/MockLanguageCommand';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { LanguageError } from '../../../VO/Language/Error/LanguageError';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Language } from '../../../VO/Language/Language';
import { Languages } from '../../../VO/Language/Languages';
import { MockISO639 } from '../../../VO/Language/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { MockLanguageQuery } from '../../Mock/MockLanguageQuery';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const languageQuery1: LanguageQuery = kernel.get<LanguageQuery>(Type.LanguageKernelQuery);
      const languageQuery2: LanguageQuery = kernel.get<LanguageQuery>(Type.LanguageKernelQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('languageRedisQuery returns Alive', async () => {
      expect.assertions(2);

      const languages: Languages = Languages.empty();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();

      languageRedisQuery.all = stub;
      stub.returns(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const superposition: Schrodinger<Languages, DataSourceError | LanguageError> = await languageQuery.all().terminate();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(languages);
    });

    it('languageMySQLQuery returns Alive', async () => {
      expect.assertions(2);

      const languages: Languages = Languages.empty();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Languages, MySQLError>(new MySQLError('test faied'), MySQLError));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageMySQLQuery.all = stub2;
      stub2.returns(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub3: SinonStub = sinon.stub();

      languageRedisCommand.insertAll = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const superposition: Schrodinger<Languages, DataSourceError | LanguageError> = await languageQuery.all().terminate();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(languages);
    });

    it('languageRedisQuery and LanguageMySQLQuery returns Dead', async () => {
      expect.assertions(2);

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Languages, RedisError>(new RedisError('test failed'), RedisError));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageMySQLQuery.all = stub2;
      stub2.returns(Superposition.dead<Languages, MySQLError>(new MySQLError('test failed'), MySQLError));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const schrodinger: Schrodinger<Languages, DataSourceError | LanguageError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('languageCommand returns Dead', async () => {
      expect.assertions(2);

      const languages: Languages = Languages.empty();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Languages, RedisError>(new RedisError('test failed'), RedisError));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageMySQLQuery.all = stub2;
      stub2.returns(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub3: SinonStub = sinon.stub();

      languageRedisCommand.insertAll = stub3;
      stub3.returns(Superposition.dead<unknown, RedisError>(new RedisError('test faied'), RedisError));

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const schrodinger: Schrodinger<Languages, DataSourceError | LanguageError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const language1: MockLanguage = new MockLanguage({
        iso639: new MockISO639('ab')
      });
      const language2: MockLanguage = new MockLanguage({
        iso639: new MockISO639('aa')
      });

      const languages: Languages = Languages.ofSpread(language1, language2);

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();

      languageRedisQuery.all = stub;
      stub.returns(Superposition.alive<Languages, DataSourceError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(languages.get(language2.getLanguageID()));
    });

    it('languageQuery.all returns Dead, MySQLError', async () => {
      expect.assertions(2);

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Languages, RedisError>(new RedisError('test failed'), RedisError));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageMySQLQuery.all = stub2;
      stub2.returns(Superposition.dead<Languages, MySQLError>(new MySQLError('test failed'), MySQLError));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('languageQuery.all returns Dead, LanguageError', async () => {
      expect.assertions(2);

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();

      languageRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Languages, RedisError>(new RedisError('test failed'), RedisError));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();

      languageMySQLQuery.all = stub2;
      stub2.returns(Superposition.dead<Languages, LanguageError>(new LanguageError('test failed'), LanguageError));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const languages: Languages = Languages.ofSpread(
        new MockLanguage({
          iso639: new MockISO639('ab')
        }),
        new MockLanguage({
          iso639: new MockISO639('aa')
        })
      );

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();

      languageRedisQuery.all = stub;
      stub.returns(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});

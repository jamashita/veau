import { Alive, DataSourceError, Dead, MySQLError, RedisError, Superposition } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockLanguageCommand } from '../../../Command/Mock/MockLanguageCommand';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { Languages } from '../../../VO/Languages';
import { MockISO639 } from '../../../VO/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Mock/MockLanguage';
import { MockLanguages } from '../../../VO/Mock/MockLanguages';
import { MockLanguageQuery } from '../../Mock/MockLanguageQuery';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageKernelQuery);
      const languageQuery2: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageKernelQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('LanguageRedisQuery returns Alive', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();
      languageRedisQuery.all = stub;
      stub.resolves(Alive.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(languages);
    });

    it('LanguageMySQLQuery returns Alive', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Languages, DataSourceError>(new MySQLError('test faied')));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Alive.of<Languages, DataSourceError>(languages));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub3: SinonStub = sinon.stub();
      languageRedisCommand.insertAll = stub3;
      stub3.resolves(Alive.of<DataSourceError>());

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(languages);
    });

    it('LanguageRedisQuery nor LanguageMySQLQuery returns Dead', async () => {
      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Dead.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('LanguageCommand returns Dead', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Alive.of<Languages, NoSuchElementError>(languages));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub3: SinonStub = sinon.stub();
      languageRedisCommand.insertAll = stub3;
      stub3.resolves(Dead.of<DataSourceError>(new RedisError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const languages: MockLanguages = new MockLanguages(
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
      stub.resolves(Alive.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(
        languageMySQLQuery,
        languageRedisQuery,
        languageRedisCommand
      );
      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(languages.get(1).get());
    });

    it('LanguageQuery.all returns Dead', async () => {
      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Dead.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('no match results', async () => {
      const languages: MockLanguages = new MockLanguages(
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
      stub.resolves(Alive.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('oop'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});

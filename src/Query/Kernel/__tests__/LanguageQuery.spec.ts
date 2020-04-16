import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockLanguageCommand } from '../../../Command/Mock/MockLanguageCommand';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { DataSourceError } from '../../../General/DataSourceError';
import { MySQLError } from '../../../General/MySQL/MySQLError';
import { RedisError } from '../../../General/Redis/RedisError';
import { Failure } from '../../../General/Superposition/Failure';
import { Success } from '../../../General/Superposition/Success';
import { Superposition } from '../../../General/Superposition/Superposition';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Languages } from '../../../VO/Languages';
import { MockLanguages } from '../../../VO/Mock/MockLanguages';
import { MockLanguageQuery } from '../../Mock/MockLanguageQuery';
import { LanguageQuery } from '../LanguageQuery';

// DONE
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
    it('LanguageRedisQuery returns Success', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();
      languageRedisQuery.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isSuccess()).toEqual(true);
      expect(superposition.get()).toEqual(languages);
    });

    it('LanguageMySQLQuery returns Success', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Languages, DataSourceError>(new MySQLError('test faied')));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Success.of<Languages, DataSourceError>(languages));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub3: SinonStub = sinon.stub();
      languageRedisCommand.insertAll = stub3;
      stub3.resolves(Success.of<DataSourceError>());

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isSuccess()).toEqual(true);
      expect(superposition.get()).toEqual(languages);
    });

    it('LanguageRedisQuery nor LanguageMySQLQuery returns Failure', async () => {
      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('LanguageCommand returns Failure', async () => {
      const languages: MockLanguages = new MockLanguages();

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub3: SinonStub = sinon.stub();
      languageRedisCommand.insertAll = stub3;
      stub3.resolves(Failure.of<DataSourceError>(new RedisError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const languages: MockLanguages = new MockLanguages(
        Language.of(
          LanguageID.of(1),
          LanguageName.of('аҧсуа бызшәа'),
          LanguageName.of('Abkhazian'),
          ISO639.of('ab')
        ),
        Language.of(
          LanguageID.of(2),
          LanguageName.of('Afaraf'),
          LanguageName.of('Afar'),
          ISO639.of('aa')
        )
      );

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();
      languageRedisQuery.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isSuccess()).toEqual(true);
      expect(superposition.get()).toEqual(languages.get(1).get());
    });

    it('LanguageQuery.all returns Failure', async () => {
      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('no match results', async () => {
      const languages: MockLanguages = new MockLanguages(
        Language.of(
          LanguageID.of(1),
          LanguageName.of('аҧсуа бызшәа'),
          LanguageName.of('Abkhazian'),
          ISO639.of('ab')
        ),
        Language.of(
          LanguageID.of(2),
          LanguageName.of('Afaraf'),
          LanguageName.of('Afar'),
          ISO639.of('aa')
        )
      );

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();
      languageRedisQuery.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('oop'));

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});

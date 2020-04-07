import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockLanguageCommand } from '../../../veau-command/Mock/MockLanguageCommand';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { MockMySQLError } from '../../../veau-general/MySQL/mocks/MockMySQLError';
import { MockRedisError } from '../../../veau-general/Redis/MockRedisError';
import { RedisError } from '../../../veau-general/Redis/RedisError';
import { Failure } from '../../../veau-general/Try/Failure';
import { Success } from '../../../veau-general/Try/Success';
import { Try } from '../../../veau-general/Try/Try';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Languages } from '../../../veau-vo/Languages';
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
    it('LanguageRedisQuery returns Success', async () => {
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();
      languageRedisQuery.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(languages);
    });

    it('LanguageMySQLQuery returns Success', async () => {
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub1: SinonStub = sinon.stub();
      languageRedisQuery.all = stub1;
      stub1.resolves(Failure.of<Languages, DataSourceError>(new MockMySQLError()));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageMySQLQuery.all = stub2;
      stub2.resolves(Success.of<Languages, DataSourceError>(languages));
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const stub3: SinonStub = sinon.stub();
      languageRedisCommand.insertAll = stub3;
      stub3.resolves(Success.of<void, DataSourceError>(undefined));

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(languages);
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
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

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

    it('LanguageCommand returns Failure', async () => {
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);

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
      stub3.resolves(Failure.of<void, DataSourceError>(new MockRedisError()));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
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
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();
      languageRedisQuery.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(languages.get(1).get());
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
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

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

    it('no match results', async () => {
      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]);

      const languageRedisQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub: SinonStub = sinon.stub();
      languageRedisQuery.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(languages));
      const languageMySQLQuery: MockLanguageQuery = new MockLanguageQuery();
      const languageRedisCommand: MockLanguageCommand = new MockLanguageCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(languageMySQLQuery, languageRedisQuery, languageRedisCommand);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('oop'));

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
  });
});

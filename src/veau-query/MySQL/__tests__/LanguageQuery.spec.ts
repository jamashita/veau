import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { MySQL } from '../../../veau-general/MySQL/MySQL';
import { Try } from '../../../veau-general/Try/Try';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { Languages } from '../../../veau-vo/Languages';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageMySQLQuery);
      const languageQuery2: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageMySQLQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([
        {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: 2,
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ]);

      const languageQuery: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageMySQLQuery);
      const trial: Try<Languages, NoSuchElementError> = await languageQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      const languages: Languages = trial.get();

      expect(stub.withArgs(`SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`).called).toEqual(true);
      expect(languages.size()).toEqual(2);
      expect(languages.get(0).get().getLanguageID().get()).toEqual(1);
      expect(languages.get(0).get().getName().get()).toEqual('аҧсуа бызшәа');
      expect(languages.get(0).get().getEnglishName().get()).toEqual('Abkhazian');
      expect(languages.get(0).get().getISO639().get()).toEqual('ab');
      expect(languages.get(1).get().getLanguageID().get()).toEqual(2);
      expect(languages.get(1).get().getName().get()).toEqual('Afaraf');
      expect(languages.get(1).get().getEnglishName().get()).toEqual('Afar');
      expect(languages.get(1).get().getISO639().get()).toEqual('aa');
    });

    it('returns Failure when MySQL returns empty array', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([
      ]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageMySQLQuery);
      const trial: Try<Languages, NoSuchElementError> = await languageQuery.all();

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

  describe('findByISO639', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([
        {
          languageID: 2,
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ]);

      const languageQuery: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageMySQLQuery);
      const trial: Try<Language, NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(stub.withArgs(`SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.iso639 = :iso639;`, {
        iso639: 'aa'
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const language: Language = trial.get();
      expect(language.getLanguageID().get()).toEqual(2);
      expect(language.getName().get()).toEqual('Afaraf');
      expect(language.getEnglishName().get()).toEqual('Afar');
      expect(language.getISO639().get()).toEqual('aa');
    });

    it('MySQL returns empty array', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([
      ]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = kernel.get<LanguageQuery>(TYPE.LanguageMySQLQuery);
      const trial: Try<Language, NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        expect(err).toBeInstanceOf(NoSuchElementError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});

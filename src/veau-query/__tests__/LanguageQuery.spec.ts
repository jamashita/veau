import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/LanguageCommand';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Languages } from '../../veau-vo/Languages';
import { ILanguageQuery } from '../interfaces/ILanguageQuery';
import { LanguageQuery } from '../LanguageQuery';
import { LanguageQuery as LanguageMySQLQuery } from '../MySQL/LanguageQuery';
import { LanguageQuery as LanguageRedisQuery } from '../Redis/LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: ILanguageQuery = container.get<ILanguageQuery>(TYPE.LanguageQuery);
      const languageQuery2: ILanguageQuery = container.get<ILanguageQuery>(TYPE.LanguageQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('LanguageRedisQuery returns languages', async () => {
      const stub: SinonStub = sinon.stub();
      LanguageRedisQuery.prototype.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ])));

      const languageQuery: ILanguageQuery = container.get<ILanguageQuery>(TYPE.LanguageQuery);
      const trial: Try<Languages, NoSuchElementError> = await languageQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      const languages: Languages = trial.get();
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

    it('LanguageMySQLQuery returns languages', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageRedisQuery.prototype.all = stub1;
      stub1.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const stub2: SinonStub = sinon.stub();
      LanguageMySQLQuery.prototype.all = stub2;
      stub2.resolves(Success.of<Languages, NoSuchElementError>(Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ])));
      const stub3: SinonStub = sinon.stub();
      LanguageCommand.prototype.insertAll = stub3;
      stub3.resolves();

      const languageQuery: ILanguageQuery = container.get<ILanguageQuery>(TYPE.LanguageQuery);
      const trial: Try<Languages, NoSuchElementError> = await languageQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      const languages: Languages = trial.get();
      expect(languages.size()).toEqual(2);
      expect(languages.get(0).get().getLanguageID().get()).toEqual(1);
      expect(languages.get(0).get().getName().get()).toEqual('аҧсуа бызшәа');
      expect(languages.get(0).get().getEnglishName().get()).toEqual('Abkhazian');
      expect(languages.get(0).get().getISO639().get()).toEqual('ab');
      expect(languages.get(1).get().getLanguageID().get()).toEqual(2);
      expect(languages.get(1).get().getName().get()).toEqual('Afaraf');
      expect(languages.get(1).get().getEnglishName().get()).toEqual('Afar');
      expect(languages.get(1).get().getISO639().get()).toEqual('aa');
      expect(stub3.called).toEqual(true);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ])));

      const languageQuery: ILanguageQuery = container.get<ILanguageQuery>(TYPE.LanguageQuery);
      const trial: Try<Language, NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isSuccess()).toEqual(true);
      const language: Language = trial.get();
      expect(language.getLanguageID().get()).toEqual(2);
      expect(language.getName().get()).toEqual('Afaraf');
      expect(language.getEnglishName().get()).toEqual('Afar');
    });

    it('LanguageQuery.all returns Failure', async () => {
      const stub: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub;
      stub.resolves(Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: ILanguageQuery = container.get<ILanguageQuery>(TYPE.LanguageQuery);
      const trial: Try<Language, NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa'));

      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('no match results', async () => {
      const stub: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub;
      stub.resolves(Success.of<Languages, NoSuchElementError>(Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ])));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: ILanguageQuery = container.get<ILanguageQuery>(TYPE.LanguageQuery);
      const trial: Try<Language, NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('oop'));

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
});

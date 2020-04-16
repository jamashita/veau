import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { DataSourceError } from '../../../General/DataSourceError';
import { Failure } from '../../../General/Superposition/Failure';
import { Success } from '../../../General/Superposition/Success';
import { Superposition } from '../../../General/Superposition/Superposition';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Languages } from '../../../VO/Languages';
import { Locale } from '../../../VO/Locale';
import { MockLanguages } from '../../../VO/Mock/MockLanguages';
import { MockLocale } from '../../../VO/Mock/MockLocale';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { LanguageQuery } from '../LanguageQuery';

// DONE
describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: LanguageQuery = vault.get<LanguageQuery>(TYPE.LanguageVaultQuery);
      const languageQuery2: LanguageQuery = vault.get<LanguageQuery>(TYPE.LanguageVaultQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const locale: MockLocale = new MockLocale();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isSuccess()).toEqual(true);
      expect(superposition.get()).toEqual(locale.getLanguages());
    });

    it('LocaleQuery returns Failure', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed', 500)));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const locale: MockLocale = new MockLocale({
        languages: new MockLanguages(
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
        )
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isSuccess()).toEqual(true);
      expect(superposition.get()).toEqual(locale.getLanguages().get(1).get());
    });

    it('LocaleQuery.all returns Failure', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed', 500)));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('no match results', async () => {
      const locale: MockLocale = new MockLocale({
        languages: new MockLanguages(
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
        )
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
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

import 'reflect-metadata';

import { AJAXError, Alive, DataSourceError, Dead, Superposition } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { LanguageError } from '../../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../../VO/Language/Error/LanguagesError';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Language } from '../../../VO/Language/Language';
import { Languages } from '../../../VO/Language/Languages';
import { MockISO639 } from '../../../VO/Language/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguages } from '../../../VO/Language/Mock/MockLanguages';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { LanguageQuery } from '../LanguageQuery';

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
      stub.resolves(Alive.of<Locale, DataSourceError>(locale));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await languageQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(locale.getLanguages());
    });

    it('LocaleQuery returns Dead', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Dead.of<Locale, DataSourceError>(new AJAXError('test failed', 500)));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await languageQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguagesError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const locale: MockLocale = new MockLocale({
        languages: new MockLanguages(
          new MockLanguage({
            iso639: new MockISO639('ab')
          }),
          new MockLanguage({
            iso639: new MockISO639('aa')
          })
        )
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Alive.of<Locale, DataSourceError>(locale));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(locale.getLanguages().get(1).get());
    });

    it('LocaleQuery.all returns Dead, AJAXError', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Dead.of<Locale, DataSourceError>(new AJAXError('test failed', 500)));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('LocaleQuery.all returns Dead, LanguageError', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Dead.of<Locale, LanguagesError>(new LanguagesError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(LanguageError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('no match results', async () => {
      const locale: MockLocale = new MockLocale({
        languages: new MockLanguages(
          new MockLanguage({
            iso639: new MockISO639('ab')
          }),
          new MockLanguage({
            iso639: new MockISO639('aa')
          })
        )
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Alive.of<Locale, DataSourceError>(locale));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const superposition: Superposition<
        Language,
        LanguageError | NoSuchElementError | DataSourceError
      > = await languageQuery.findByISO639(ISO639.of('oop'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LanguageError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});

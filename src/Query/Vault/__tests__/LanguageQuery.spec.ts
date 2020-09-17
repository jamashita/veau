import { AJAXError } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { LanguageError } from '../../../VO/Language/Error/LanguageError';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Language } from '../../../VO/Language/Language';
import { Languages } from '../../../VO/Language/Languages';
import { MockISO639 } from '../../../VO/Language/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  // TODO
  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('container', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  //   it('must be a singleton', () => {
  //     const languageQuery1: LanguageQuery = v.get<LanguageQuery>(Type.LanguageVaultQuery);
  //     const languageQuery2: LanguageQuery = v.get<LanguageQuery>(Type.LanguageVaultQuery);
  //
  //     expect(languageQuery1).toBeInstanceOf(LanguageQuery);
  //     expect(languageQuery1).toBe(languageQuery2);
  //   });
  // });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Languages, LanguageError | DataSourceError> = await languageQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale.getLanguages());
    });

    it('localeQuery returns Dead', async () => {
      expect.assertions(2);

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, AJAXError>(new AJAXError('test failed', 500), AJAXError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Languages, LanguageError | DataSourceError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const languageID: MockLanguageID = new MockLanguageID();
      const language1: MockLanguage = new MockLanguage({
        languageID
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID()
      });
      const locale: MockLocale = new MockLocale({
        languages: [language1, language2]
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(language1);
    });

    it('localeQuery.all returns Dead, AJAXError', async () => {
      expect.assertions(2);

      const languageID: MockLanguageID = new MockLanguageID();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, DataSourceError>(new AJAXError('test failed', 500), AJAXError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });

    it('localeQuery.all returns Dead, LanguageError', async () => {
      expect.assertions(2);

      const languageID: MockLanguageID = new MockLanguageID();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, LanguageError>(new LanguageError('test failed'), LanguageError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const languageID: MockLanguageID = new MockLanguageID();
      const language1: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID()
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID()
      });
      const locale: MockLocale = new MockLocale({
        languages: [language1, language2]
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
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
      const locale: MockLocale = new MockLocale({
        languages: [language1, language2]
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(language2);
    });

    it('localeQuery.all returns Dead, AJAXError', async () => {
      expect.assertions(2);

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, DataSourceError>(new AJAXError('test failed', 500), AJAXError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });

    it('localeQuery.all returns Dead, LanguageError', async () => {
      expect.assertions(2);

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, LanguageError>(new LanguageError('test failed'), LanguageError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale({
        languages: [
          new MockLanguage({
            iso639: new MockISO639('ab')
          }),
          new MockLanguage({
            iso639: new MockISO639('aa')
          })
        ]
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, LanguageError | NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});

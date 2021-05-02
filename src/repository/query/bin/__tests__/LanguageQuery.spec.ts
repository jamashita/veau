import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError } from '@jamashita/catacombe-fetch';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { bin } from '../../../../container/Bin';
import { Type } from '../../../../container/Types';
import { LanguageError } from '../../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../../domain/vo/Language/ISO639';
import { Language } from '../../../../domain/vo/Language/Language';
import { Languages } from '../../../../domain/vo/Language/Languages';
import { MockISO639 } from '../../../../domain/vo/Language/mock/MockISO639';
import { MockLanguage } from '../../../../domain/vo/Language/mock/MockLanguage';
import { MockLanguageID } from '../../../../domain/vo/Language/mock/MockLanguageID';
import { Locale } from '../../../../domain/vo/Locale/Locale';
import { MockLocale } from '../../../../domain/vo/Locale/mock/MockLocale';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { MockLocaleQuery } from '../../mock/MockLocaleQuery';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const languageQuery1: LanguageQuery = bin.get<LanguageQuery>(Type.LanguageBinQuery);
      const languageQuery2: LanguageQuery = bin.get<LanguageQuery>(Type.LanguageBinQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale();

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeBinQuery);
      const schrodinger: Schrodinger<Languages, DataSourceError | LanguageError> = await languageQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale.getLanguages());
    });

    it('localeQuery returns Dead', async () => {
      expect.assertions(2);

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.dead<Locale, FetchError>(new FetchError('test failed'), FetchError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeBinQuery);
      const schrodinger: Schrodinger<Languages, DataSourceError | LanguageError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
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

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeBinQuery);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(language1);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const languageID: MockLanguageID = new MockLanguageID();

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.dead<Locale, DataSourceError>(new FetchError('test failed'), FetchError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeBinQuery);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, LanguageError', async () => {
      expect.assertions(2);

      const languageID: MockLanguageID = new MockLanguageID();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, LanguageError>(new LanguageError('test failed'), LanguageError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.find(languageID).terminate();

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
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.find(languageID).terminate();

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
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(language2);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, DataSourceError>(new FetchError('test failed'), FetchError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, LanguageError', async () => {
      expect.assertions(2);

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, LanguageError>(new LanguageError('test failed'), LanguageError));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

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
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});

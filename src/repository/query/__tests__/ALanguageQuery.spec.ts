import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError } from '@jamashita/catacombe-fetch';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { Superposition } from '@jamashita/genitore-superposition';
import 'reflect-metadata';
import { LanguageError } from '../../../../domain/vo/Language/error/LanguageError.js';
import { ISO639 } from '../../../../domain/vo/Language/ISO639.js';
import { Language } from '../../../../domain/vo/Language/Language.js';
import { Languages } from '../../../../domain/vo/Language/Languages.js';
import { MockISO639 } from '../../../../domain/vo/Language/mock/MockISO639.js';
import { MockLanguage } from '../../../../domain/vo/Language/mock/MockLanguage.js';
import { MockLanguageID } from '../../../../domain/vo/Language/mock/MockLanguageID.js';
import { NoSuchElementError } from '../../error/NoSuchElementError.js';
import { ALanguageQuery } from '../ALanguageQuery.js';

class MockALanguageQuery extends ALanguageQuery {
  private readonly a: Superposition<Languages, DataSourceError | LanguageError>;
  public readonly source: 'Mock' = 'Mock';

  public constructor(all: Superposition<Languages, DataSourceError | LanguageError>) {
    super();
    this.a = all;
  }

  public all(): Superposition<Languages, DataSourceError | LanguageError> {
    return this.a;
  }
}

describe('ALanguageQuery', () => {
  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const language1: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID()
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID()
      });
      const languages: Languages = Languages.ofSpread(language1, language2);

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));
      const schrodinger: Schrodinger<Languages, DataSourceError | LanguageError> = await languageQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(languages);
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
      const languages: Languages = Languages.ofSpread(language1, language2);

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.alive<Languages, DataSourceError>(languages, DataSourceError));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(language1);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const languageID: MockLanguageID = new MockLanguageID();

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.dead<Languages, DataSourceError>(new FetchError('test failed'), FetchError));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, LanguageError', async () => {
      expect.assertions(2);

      const languageID: MockLanguageID = new MockLanguageID();

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.dead<Languages, LanguageError>(new LanguageError('test failed'), LanguageError));
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
      const languages: Languages = Languages.ofSpread(language1, language2);

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.alive<Languages, DataSourceError>(languages));
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

      const languages: Languages = Languages.ofSpread(language1, language2);

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.alive<Languages, DataSourceError>(languages));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(languages.get(language2.getLanguageID()));
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.dead<Languages, DataSourceError>(new FetchError('test failed'), FetchError));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, LanguageError', async () => {
      expect.assertions(2);

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.dead<Languages, LanguageError>(new LanguageError('test failed'), LanguageError));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const language1: MockLanguage = new MockLanguage({
        iso639: new MockISO639('ab')
      });
      const language2: MockLanguage = new MockLanguage({
        iso639: new MockISO639('aa')
      });

      const languages: Languages = Languages.ofSpread(language1, language2);

      const languageQuery: MockALanguageQuery = new MockALanguageQuery(Superposition.alive<Languages, DataSourceError>(languages));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});

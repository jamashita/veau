import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import { LanguageError } from '../../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../../domain/vo/Language/ISO639';
import { Language } from '../../../../domain/vo/Language/Language';
import { Languages } from '../../../../domain/vo/Language/Languages';
import { MockISO639 } from '../../../../domain/vo/Language/mock/MockISO639';
import { MockLanguage } from '../../../../domain/vo/Language/mock/MockLanguage';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { LanguageQueryFindByISO639 } from '../LanguageQueryFindByISO639';

describe('LanguageQueryFindByISO639', () => {
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

      const languageQuery: LanguageQueryFindByISO639 = LanguageQueryFindByISO639.of(Superposition.alive<Languages, DataSourceError>(languages));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(languages.get(language2.getLanguageID()));
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

      const languageQuery: LanguageQueryFindByISO639 = LanguageQueryFindByISO639.of(Superposition.alive<Languages, DataSourceError>(languages));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('oop')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});

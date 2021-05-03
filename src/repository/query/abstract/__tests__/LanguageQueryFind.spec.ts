import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import { LanguageError } from '../../../../domain/vo/Language/error/LanguageError';
import { Language } from '../../../../domain/vo/Language/Language';
import { Languages } from '../../../../domain/vo/Language/Languages';
import { MockLanguage } from '../../../../domain/vo/Language/mock/MockLanguage';
import { MockLanguageID } from '../../../../domain/vo/Language/mock/MockLanguageID';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { LanguageQueryFind } from '../LanguageQueryFind';

describe('LanguageQueryFind', () => {
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

      const languageQuery: LanguageQueryFind = LanguageQueryFind.of(Superposition.alive<Languages, DataSourceError>(languages));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(language1);
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

      const languageQuery: LanguageQueryFind = LanguageQueryFind.of(Superposition.alive<Languages, DataSourceError>(languages));
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageQuery.find(languageID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});

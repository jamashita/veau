import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { ISO639 } from '../../../../domain/Language/ISO639';
import { Language } from '../../../../domain/Language/Language';
import { LanguageError } from '../../../../domain/Language/LanguageError';
import { LanguageID } from '../../../../domain/Language/LanguageID';
import { Languages } from '../../../../domain/Language/Languages';
import { MockLanguage } from '../../../../domain/Language/mock/MockLanguage';
import { NoSuchElementError } from '../../../../repository/query/error/NoSuchElementError';
import { MixinLanguageRepository } from '../MixinLanguageRepository';

describe('MixinLanguageRepository', () => {
  describe('find', () => {
    it('normal case', async () => {
      const languageID: LanguageID = LanguageID.ofString('bde3e667-c784-4c49-bb18-068f90ddd8ba');
      const language1: MockLanguage = new MockLanguage({
        languageID
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('9583b0c5-7bd6-4eac-97ef-cfcded537654')
      });
      const languages: Languages = Languages.ofArray([language1, language2]);

      const languageRepository: MixinLanguageRepository = new MixinLanguageRepository(languages);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageRepository.find(languageID);

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(language1);
    });

    it('no match results', async () => {
      const languageID: LanguageID = LanguageID.ofString('bde3e667-c784-4c49-bb18-068f90ddd8ba');
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('adb627ff-8ce4-42e4-8944-d6d4c5afb585')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('a54db914-d7e0-4dab-9ed9-6f42ddaff50c')
      });
      const languages: Languages = Languages.ofArray([language1, language2]);

      const languageRepository: MixinLanguageRepository = new MixinLanguageRepository(languages);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageRepository.find(languageID);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const language1: MockLanguage = new MockLanguage({
        iso639: ISO639.of('ab')
      });
      const language2: MockLanguage = new MockLanguage({
        iso639: ISO639.of('aa')
      });
      const languages: Languages = Languages.ofArray([language1, language2]);

      const languageRepository: MixinLanguageRepository = new MixinLanguageRepository(languages);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageRepository.findByISO639(ISO639.of('aa'));

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(languages.get(language2.getLanguageID()));
    });

    it('no match results', async () => {
      const language1: MockLanguage = new MockLanguage({
        iso639: ISO639.of('ab')
      });
      const language2: MockLanguage = new MockLanguage({
        iso639: ISO639.of('aa')
      });
      const languages: Languages = Languages.ofArray([language1, language2]);

      const languageRepository: MixinLanguageRepository = new MixinLanguageRepository(languages);
      const schrodinger: Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError> = await languageRepository.findByISO639(ISO639.of('oop'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});

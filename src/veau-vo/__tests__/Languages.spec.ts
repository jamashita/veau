import 'jest';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { ISO639 } from '../ISO639';
import { Language, LanguageJSON, LanguageRow } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Languages } from '../Languages';

describe('Languages', () => {
  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));
      const language3: Language = Language.of(LanguageID.of(3), LanguageName.of('language 3'), LanguageName.of('english language 3'), ISO639.of('ac'));

      const languages: Languages = Languages.of([language1, language2, language3]);

      expect(languages.size()).toEqual(3);
      expect(languages.get(0)).toEqual(language1);
      expect(languages.get(1)).toEqual(language2);
      expect(languages.get(2)).toEqual(language3);
    });

    it('throws NoSuchElementError when the index is out of range', () => {
      const languages: Languages = Languages.of([]);

      expect(() => {
        languages.get(-1);
      }).toThrow(NoSuchElementError);
      expect(() => {
        languages.get(0);
      }).toThrow(NoSuchElementError);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Colors', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));
      const language3: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language4: Language = Language.of(LanguageID.of(3), LanguageName.of('language 3'), LanguageName.of('english language 3'), ISO639.of('ac'));

      const languages: Languages = Languages.of([language1, language2]);

      expect(languages.contains(language1)).toEqual(true);
      expect(languages.contains(language2)).toEqual(true);
      expect(languages.contains(language3)).toEqual(true);
      expect(languages.contains(language4)).toEqual(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.of([]);
      const languages2: Languages = Languages.of([language1, language2]);

      expect(languages1.isEmpty()).toEqual(true);
      expect(languages2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.of([language1, language2]);
      const languages2: Languages = Languages.of([language1]);

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.of([language1, language2]);
      const languages2: Languages = Languages.of([language2, language1]);

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.of([language1, language2]);
      const languages2: Languages = Languages.of([language1, language2]);

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));

      const languages: Languages = Languages.of([language1]);

      expect(languages.toJSON()).toEqual([
        {
          languageID: 1,
          name: 'language 1',
          englishName: 'english language 1',
          iso639: 'aa'
        }
      ]);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: 1,
          name: 'language name',
          englishName: 'english language name',
          iso639: 'aa'
        }
      ];

      const languages: Languages = Languages.ofJSON(json);

      expect(languages.size()).toEqual(1);
      expect(languages.get(0).getLanguageID().get()).toEqual(json[0].languageID);
      expect(languages.get(0).getName().get()).toEqual(json[0].name);
      expect(languages.get(0).getEnglishName().get()).toEqual(json[0].englishName);
      expect(languages.get(0).getISO639().get()).toEqual(json[0].iso639);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const rows: Array<LanguageRow> = [
        {
          languageID: 1,
          name: 'language name',
          englishName: 'english language name',
          iso639: 'aa'
        }
      ];

      const languages: Languages = Languages.ofRow(rows);

      expect(languages.size()).toEqual(1);
      expect(languages.get(0).getLanguageID().get()).toEqual(rows[0].languageID);
      expect(languages.get(0).getName().get()).toEqual(rows[0].name);
      expect(languages.get(0).getEnglishName().get()).toEqual(rows[0].englishName);
      expect(languages.get(0).getISO639().get()).toEqual(rows[0].iso639);
    });
  });
});

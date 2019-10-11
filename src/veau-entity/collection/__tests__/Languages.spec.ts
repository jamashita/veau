import 'jest';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Language, LanguageJSON, LanguageRow } from '../../../veau-vo/Language';
import { Languages } from '../../../veau-vo/collection/Languages';

describe('Languages', () => {
  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));
      const language3: Language = Language.of(LanguageID.of(3), LanguageName.of('language 3'), LanguageName.of('english language 3'), ISO639.of('ac'));

      const languages: Languages = Languages.from([language1, language2, language3]);

      expect(languages.length()).toEqual(3);
      expect(languages.get(0)).toEqual(language1);
      expect(languages.get(1)).toEqual(language2);
      expect(languages.get(2)).toEqual(language3);
    });

    it('throws error when the index is out of range', () => {
      const languages: Languages = Languages.from([]);

      expect(() => {
        languages.get(-1);
      }).toThrow(NoSuchElementError);
      expect(() => {
        languages.get(0);
      }).toThrow(NoSuchElementError);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.from([language1, language2]);
      const languages2: Languages = Languages.from([language1]);

      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.from([language1, language2]);
      const languages2: Languages = Languages.from([language2, language1]);

      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.from([language1, language2]);
      const languages2: Languages = Languages.from([language1, language2]);

      expect(languages1.equals(languages2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));

      const languages: Languages = Languages.from([language1]);

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

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: 1,
          name: 'language name',
          englishName: 'english language name',
          iso639: 'aa'
        }
      ];

      const languages: Languages = Languages.fromJSON(json);

      expect(languages.length()).toEqual(1);
      expect(languages.get(0).getLanguageID().get()).toEqual(json[0].languageID);
      expect(languages.get(0).getName().get()).toEqual(json[0].name);
      expect(languages.get(0).getEnglishName().get()).toEqual(json[0].englishName);
      expect(languages.get(0).getISO639().get()).toEqual(json[0].iso639);
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const rows: Array<LanguageRow> = [
        {
          languageID: 1,
          name: 'language name',
          englishName: 'english language name',
          iso639: 'aa'
        }
      ];

      const languages: Languages = Languages.fromRow(rows);

      expect(languages.length()).toEqual(1);
      expect(languages.get(0).getLanguageID().get()).toEqual(rows[0].languageID);
      expect(languages.get(0).getName().get()).toEqual(rows[0].name);
      expect(languages.get(0).getEnglishName().get()).toEqual(rows[0].englishName);
      expect(languages.get(0).getISO639().get()).toEqual(rows[0].iso639);
    });
  });
});

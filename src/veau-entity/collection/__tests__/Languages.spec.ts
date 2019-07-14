import 'jest';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { Language } from '../../Language';
import { Languages } from '../Languages';

describe('Languages', () => {
  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const language1: Language = Language.from(LanguageID.of(1), 'language 1', 'english language 1', ISO639.of('aa'));
      const language2: Language = Language.from(LanguageID.of(2), 'language 2', 'english language 2', ISO639.of('ab'));
      const language3: Language = Language.from(LanguageID.of(3), 'language 3', 'english language 3', ISO639.of('ac'));

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
      const language1: Language = Language.from(LanguageID.of(1), 'language 1', 'english language 1', ISO639.of('aa'));
      const language2: Language = Language.from(LanguageID.of(2), 'language 2', 'english language 2', ISO639.of('ab'));

      const languages1: Languages = Languages.from([language1, language2]);
      const languages2: Languages = Languages.from([language1]);

      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const language1: Language = Language.from(LanguageID.of(1), 'language 1', 'english language 1', ISO639.of('aa'));
      const language2: Language = Language.from(LanguageID.of(2), 'language 2', 'english language 2', ISO639.of('ab'));

      const languages1: Languages = Languages.from([language1, language2]);
      const languages2: Languages = Languages.from([language2, language1]);

      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const language1: Language = Language.from(LanguageID.of(1), 'language 1', 'english language 1', ISO639.of('aa'));
      const language2: Language = Language.from(LanguageID.of(2), 'language 2', 'english language 2', ISO639.of('ab'));

      const languages1: Languages = Languages.from([language1, language2]);
      const languages2: Languages = Languages.from([language1, language2]);

      expect(languages1.equals(languages2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language1: Language = Language.from(LanguageID.of(1), 'language 1', 'english language 1', ISO639.of('aa'));

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
});

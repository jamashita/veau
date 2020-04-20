import { ISO639 } from '../ISO639';
import { Language, LanguageJSON, LanguageRow } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { MockISO639 } from '../Mock/MockISO639';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockLanguageName } from '../Mock/MockLanguageName';

describe('Language', () => {
  describe('of', () => {
    it('normal case', () => {
      const languageID: LanguageID = LanguageID.of(1);
      const name: LanguageName = LanguageName.of('Afaraf');
      const englishName: LanguageName = LanguageName.of('Afar');
      const iso639: ISO639 = ISO639.of('aa');

      const language: Language = Language.of(
        languageID,
        name,
        englishName,
        iso639
      );

      expect(language.getLanguageID()).toBe(languageID);
      expect(language.getName()).toBe(name);
      expect(language.getEnglishName()).toBe(englishName);
      expect(language.getISO639()).toBe(iso639);
    });

    it('all are empty, returns Language.empty()', () => {
      const language: Language = Language.of(
        LanguageID.empty(),
        LanguageName.empty(),
        LanguageName.empty(),
        ISO639.empty()
      );

      expect(language).toBe(Language.empty());
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: LanguageJSON = {
        languageID: 2,
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      const language: Language = Language.ofJSON(json);

      expect(language.getLanguageID().get()).toBe(json.languageID);
      expect(language.getName().get()).toBe(json.name);
      expect(language.getEnglishName().get()).toBe(json.englishName);
      expect(language.getISO639().get()).toBe(json.iso639);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: LanguageRow = {
        languageID: 2,
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      const language: Language = Language.ofRow(row);

      expect(language.getLanguageID().get()).toBe(row.languageID);
      expect(language.getName().get()).toBe(row.name);
      expect(language.getEnglishName().get()).toBe(row.englishName);
      expect(language.getISO639().get()).toBe(row.iso639);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
        languageID: 2,
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(Language.isJSON(null)).toBe(false);
      expect(Language.isJSON(undefined)).toBe(false);
      expect(Language.isJSON(56)).toBe(false);
      expect(Language.isJSON('fjafsd')).toBe(false);
      expect(Language.isJSON(false)).toBe(false);
    });

    it('returns false because languageID is missing', () => {
      const n: unknown = {
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because languageID is not number', () => {
      const n: unknown = {
        languageID: 'tis tis',
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      const n: unknown = {
        languageID: 2,
        englishName: 'Afar',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      const n: unknown = {
        languageID: 2,
        name: false,
        englishName: 'Afar',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because englishName is missing', () => {
      const n: unknown = {
        languageID: 2,
        name: 'Afaraf',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because englishName is not string', () => {
      const n: unknown = {
        languageID: 2,
        name: 'Afaraf',
        englishName: true,
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because iso639 is missing', () => {
      const n: unknown = {
        languageID: 2,
        name: 'Afaraf',
        englishName: 'Afar'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because iso639 is not string', () => {
      const n: unknown = {
        languageID: 2,
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 100
      };

      expect(Language.isJSON(n)).toBe(false);
    });
  });

  describe('empty', () => {
    it('returns each default value', () => {
      const language: Language = Language.empty();

      expect(language.getLanguageID()).toBe(LanguageID.empty());
      expect(language.getName()).toBe(LanguageName.empty());
      expect(language.getEnglishName()).toBe(LanguageName.empty());
      expect(language.getISO639()).toBe(ISO639.empty());
    });

    it('returns singleton instance', () => {
      expect(Language.empty()).toBe(Language.empty());
    });
  });

  describe('equals', () => {
    it('returns true if the all of the properties are the same', () => {
      const language1: Language = Language.of(
        new MockLanguageID(1),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('ab')
      );
      const language2: Language = Language.of(
        new MockLanguageID(2),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('ab')
      );
      const language3: Language = Language.of(
        new MockLanguageID(1),
        new MockLanguageName('Afaraf'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('ab')
      );
      const language4: Language = Language.of(
        new MockLanguageID(1),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Afar'),
        new MockISO639('ab')
      );
      const language5: Language = Language.of(
        new MockLanguageID(1),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('aa')
      );
      const language6: Language = Language.of(
        new MockLanguageID(1),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('ab')
      );

      expect(language1.equals(language1)).toBe(true);
      expect(language1.equals(language2)).toBe(false);
      expect(language1.equals(language3)).toBe(false);
      expect(language1.equals(language4)).toBe(false);
      expect(language1.equals(language5)).toBe(false);
      expect(language1.equals(language6)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language: Language = Language.of(
        LanguageID.of(1),
        LanguageName.of('аҧсуа бызшәа'),
        LanguageName.of('Abkhazian'),
        ISO639.of('ab')
      );

      expect(language.toJSON()).toEqual({
        languageID: 1,
        name: 'аҧсуа бызшәа',
        englishName: 'Abkhazian',
        iso639: 'ab'
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: number = 1;
      const name1: string = 'аҧсуа бызшәа';
      const name2: string = 'Abkhazian';
      const iso639: string = 'ab';

      const language: Language = Language.of(
        LanguageID.of(id),
        LanguageName.of(name1),
        LanguageName.of(name2),
        ISO639.of(iso639)
      );

      expect(language.toString()).toBe(`${id} ${name1} ${name2} ${iso639}`);
    });
  });
});

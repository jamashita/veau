import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { LanguageError } from '../Error/LanguageError';
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
      const languageID: MockLanguageID = new MockLanguageID();
      const name: MockLanguageName = new MockLanguageName();
      const englishName: MockLanguageName = new MockLanguageName();
      const iso639: MockISO639 = new MockISO639();

      const language: Language = Language.of(languageID, name, englishName, iso639);

      expect(language.getLanguageID()).toBe(languageID);
      expect(language.getName()).toBe(name);
      expect(language.getEnglishName()).toBe(englishName);
      expect(language.getISO639()).toBe(iso639);
    });

    it('returns Language.empty() if LanguageID is empty', () => {
      const language: Language = Language.of(
        LanguageID.empty(),
        LanguageName.empty(),
        LanguageName.empty(),
        ISO639.empty()
      );

      expect(language).toBe(Language.empty());
    });

    it('returns Language.empty() if LanguageName is empty 1', () => {
      const language: Language = Language.of(
        new MockLanguageID(),
        LanguageName.empty(),
        new MockLanguageName(),
        ISO639.empty()
      );

      expect(language).toBe(Language.empty());
    });

    it('returns Language.empty() if LanguageName is empty 2', () => {
      const language: Language = Language.of(
        new MockLanguageID(),
        new MockLanguageName(),
        LanguageName.empty(),
        ISO639.empty()
      );

      expect(language).toBe(Language.empty());
    });

    it('returns Language.empty() if ISO639 is empty', () => {
      const language: Language = Language.of(
        new MockLanguageID(),
        new MockLanguageName(),
        new MockLanguageName(),
        ISO639.empty()
      );

      expect(language).toBe(Language.empty());
    });
  });

  describe('ofJSON', () => {
    it('normal case', async () => {
      const json: LanguageJSON = {
        languageID: UUID.v4().get(),
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      const superposition: Superposition<Language, LanguageError> = Language.ofJSON(json);
      const schrodinger: Schrodinger<Language, LanguageError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const language: Language = schrodinger.get();

      expect(language.getLanguageID().get().get()).toBe(json.languageID);
      expect(language.getName().get()).toBe(json.name);
      expect(language.getEnglishName().get()).toBe(json.englishName);
      expect(language.getISO639().get()).toBe(json.iso639);
    });

    it('returns Dead if languageID is malformat', async () => {
      const json: LanguageJSON = {
        languageID: 'puente',
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      const superposition: Superposition<Language, LanguageError> = Language.ofJSON(json);
      const schrodinger: Schrodinger<Language, LanguageError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });
  });

  describe('ofRow', () => {
    it('normal case', async () => {
      const row: LanguageRow = {
        languageID: UUID.v4().get(),
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      const superposition: Superposition<Language, LanguageError> = Language.ofRow(row);
      const schrodinger: Schrodinger<Language, LanguageError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const language: Language = schrodinger.get();

      expect(language.getLanguageID().get().get()).toBe(row.languageID);
      expect(language.getName().get()).toBe(row.name);
      expect(language.getEnglishName().get()).toBe(row.englishName);
      expect(language.getISO639().get()).toBe(row.iso639);
    });

    it('returns Dead if languageID is malformat', async () => {
      const row: LanguageRow = {
        languageID: 'puente',
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      const superposition: Superposition<Language, LanguageError> = Language.ofRow(row);
      const schrodinger: Schrodinger<Language, LanguageError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageError);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
        languageID: 'tis tis',
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

    it('returns false because languageID is not string', () => {
      const n: unknown = {
        languageID: 1,
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      const n: unknown = {
        languageID: 'tis tis',
        englishName: 'Afar',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      const n: unknown = {
        languageID: 'tis tis',
        name: false,
        englishName: 'Afar',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because englishName is missing', () => {
      const n: unknown = {
        languageID: 'tis tis',
        name: 'Afaraf',
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because englishName is not string', () => {
      const n: unknown = {
        languageID: 'tis tis',
        name: 'Afaraf',
        englishName: true,
        iso639: 'aa'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because iso639 is missing', () => {
      const n: unknown = {
        languageID: 'tis tis',
        name: 'Afaraf',
        englishName: 'Afar'
      };

      expect(Language.isJSON(n)).toBe(false);
    });

    it('returns false because iso639 is not string', () => {
      const n: unknown = {
        languageID: 'tis tis',
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
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const language1: Language = Language.of(
        new MockLanguageID(uuid1),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('ab')
      );
      const language2: Language = Language.of(
        new MockLanguageID(uuid2),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('ab')
      );
      const language3: Language = Language.of(
        new MockLanguageID(uuid1),
        new MockLanguageName('Afaraf'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('ab')
      );
      const language4: Language = Language.of(
        new MockLanguageID(uuid1),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Afar'),
        new MockISO639('ab')
      );
      const language5: Language = Language.of(
        new MockLanguageID(uuid1),
        new MockLanguageName('аҧсуа бызшәа'),
        new MockLanguageName('Abkhazian'),
        new MockISO639('aa')
      );
      const language6: Language = Language.of(
        new MockLanguageID(uuid1),
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
      const uuid: UUID = UUID.v4();
      const language: Language = Language.of(
        LanguageID.of(uuid),
        LanguageName.of('аҧсуа бызшәа'),
        LanguageName.of('Abkhazian'),
        ISO639.of('ab')
      );

      expect(language.toJSON()).toEqual({
        languageID: uuid.get(),
        name: 'аҧсуа бызшәа',
        englishName: 'Abkhazian',
        iso639: 'ab'
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const name1: string = 'аҧсуа бызшәа';
      const name2: string = 'Abkhazian';
      const iso639: string = 'ab';

      const language: Language = Language.of(
        LanguageID.of(uuid),
        LanguageName.of(name1),
        LanguageName.of(name2),
        ISO639.of(iso639)
      );

      expect(language.toString()).toBe(`${uuid.get()} ${name1} ${name2} ${iso639}`);
    });
  });
});

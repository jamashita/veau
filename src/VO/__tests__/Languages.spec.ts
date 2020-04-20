import { ImmutableSequence } from '../../General/Collection/Sequence/ImmutableSequence';
import { Absent } from '../../General/Quantum/Absent';
import { ISO639 } from '../ISO639';
import { Language, LanguageJSON, LanguageRow } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Languages } from '../Languages';
import { MockISO639 } from '../Mock/MockISO639';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockLanguageName } from '../Mock/MockLanguageName';

describe('Languages', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns Languages.empty()', () => {
      const languages: Languages = Languages.of(ImmutableSequence.empty<Language>());

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const sequence: ImmutableSequence<MockLanguage> = ImmutableSequence.of<Language>([
        language1,
        language2
      ]);

      const languages: Languages = Languages.of(sequence);

      expect(languages.size()).toBe(sequence.size());
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns Languages.empty()', () => {
      const languages: Languages = Languages.ofJSON([]);

      expect(languages).toBe(Languages.empty());
    });

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

      expect(languages.size()).toBe(json.length);
      for (let i: number = 0; i < languages.size(); i++) {
        const language: Language = languages.get(i).get();
        expect(language.getLanguageID().get()).toBe(json[i].languageID);
        expect(language.getName().get()).toBe(json[i].name);
        expect(language.getEnglishName().get()).toBe(json[i].englishName);
        expect(language.getISO639().get()).toBe(json[i].iso639);
      }
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns Languages.empty()', () => {
      const languages: Languages = Languages.ofRow([]);

      expect(languages).toBe(Languages.empty());
    });

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

      expect(languages.size()).toBe(rows.length);
      for (let i: number = 0; i < languages.size(); i++) {
        const language: Language = languages.get(i).get();
        expect(language.getLanguageID().get()).toBe(rows[i].languageID);
        expect(language.getName().get()).toBe(rows[i].name);
        expect(language.getEnglishName().get()).toBe(rows[i].englishName);
        expect(language.getISO639().get()).toBe(rows[i].iso639);
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns Languages.empty()', () => {
      const languages: Languages = Languages.ofArray([]);

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', () => {
      const langs: Array<MockLanguage> = [
        new MockLanguage(),
        new MockLanguage()
      ];

      const languages: Languages = Languages.ofArray(langs);

      expect(languages.size()).toBe(langs.length);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(i).get()).toBe(langs[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns Languages.empty()', () => {
      const languages: Languages = Languages.ofSpread();

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const langs: Array<MockLanguage> = [
        language1,
        language2
      ];

      const languages: Languages = Languages.ofSpread(
        language1,
        language2
      );

      expect(languages.size()).toBe(langs.length);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(i).get()).toBe(langs[i]);
      }
    });
  });

  describe('empty', () => {
    it('generates 0-length Languages', () => {
      expect(Languages.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(Languages.empty()).toBe(Languages.empty());
    });
  });

  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const langs: Array<MockLanguage> = [
        new MockLanguage(),
        new MockLanguage(),
        new MockLanguage()
      ];

      const languages: Languages = Languages.ofArray(langs);

      expect(languages.size()).toBe(3);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(i).get()).toBe(langs[i]);
      }
    });

    it('returns Absent when the index is out of range', () => {
      const languages: Languages = Languages.empty();

      expect(languages.get(-1)).toBeInstanceOf(Absent);
      expect(languages.get(0)).toBeInstanceOf(Absent);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(2)
      });
      const language3: MockLanguage = new MockLanguage();
      const language4: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(3)
      });

      const languages: Languages = Languages.ofArray([
        language1,
        language2
      ]);

      expect(languages.contains(language1)).toBe(true);
      expect(languages.contains(language2)).toBe(true);
      expect(languages.contains(language3)).toBe(true);
      expect(languages.contains(language4)).toBe(false);
    });
  });

  describe('find', () => {
    it('returns Present if the element exists', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(1)
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(2)
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(1)
      });
      const language4: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(3)
      });

      const languages: Languages = Languages.ofArray([
        language1,
        language2
      ]);

      expect(languages.find((language: Language) => {
        return language1.equals(language);
      }).isPresent()).toBe(true);
      expect(languages.find((language: Language) => {
        return language2.equals(language);
      }).isPresent()).toBe(true);
      expect(languages.find((language: Language) => {
        return language3.equals(language);
      }).isPresent()).toBe(true);
      expect(languages.find((language: Language) => {
        return language4.equals(language);
      }).isPresent()).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const languages1: Languages = Languages.empty();
      const languages2: Languages = Languages.ofArray([
        new MockLanguage(),
        new MockLanguage({
          languageID: new MockLanguageID(2),
          name: new MockLanguageName('language'),
          iso639: new MockISO639('ab')
        })
      ]);

      expect(languages1.isEmpty()).toBe(true);
      expect(languages2.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(2),
        name: new MockLanguageName('language'),
        iso639: new MockISO639('ab')
      });

      const languages1: Languages = Languages.ofArray([
        language1,
        language2
      ]);
      const languages2: Languages = Languages.ofArray([
        language1
      ]);

      expect(languages1.equals(languages1)).toBe(true);
      expect(languages1.equals(languages2)).toBe(false);
    });

    it('returns false if the sequence is different', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(2),
        name: new MockLanguageName('language'),
        iso639: new MockISO639('ab')
      });

      const languages1: Languages = Languages.ofArray([
        language1,
        language2
      ]);
      const languages2: Languages = Languages.ofArray([
        language2,
        language1
      ]);

      expect(languages1.equals(languages1)).toBe(true);
      expect(languages1.equals(languages2)).toBe(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(2),
        name: new MockLanguageName('language'),
        iso639: new MockISO639('ab')
      });

      const languages1: Languages = Languages.ofArray([
        language1,
        language2
      ]);
      const languages2: Languages = Languages.ofArray([
        language1,
        language2
      ]);

      expect(languages1.equals(languages1)).toBe(true);
      expect(languages1.equals(languages2)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const languages: Languages = Languages.ofArray([
        Language.of(
          LanguageID.of(1),
          LanguageName.of('language 1'),
          LanguageName.of('english language 1'),
          ISO639.of('aa')
        )
      ]);

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

  describe('toString', () => {
    it('normal case', () => {
      const id1: number = 1;
      const id2: number = 2;
      const name1: string = 'language 1';
      const name2: string = 'language 2';
      const englishName1: string = 'english language 1';
      const englishName2: string = 'english language 2';
      const iso6391: string = 'aa';
      const iso6392: string = 'ab';

      const languages: Languages = Languages.ofArray([
        Language.of(
          LanguageID.of(id1),
          LanguageName.of(name1),
          LanguageName.of(englishName1),
          ISO639.of(iso6391)
        ),
        Language.of(
          LanguageID.of(id2),
          LanguageName.of(name2),
          LanguageName.of(englishName2),
          ISO639.of(iso6392)
        )
      ]);

      expect(languages.toString()).toBe(`${id1} ${name1} ${englishName1} ${iso6391}, ${id2} ${name2} ${englishName2} ${iso6392}`);
    });
  });
});

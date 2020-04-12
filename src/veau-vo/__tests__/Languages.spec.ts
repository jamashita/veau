import { None } from '../../veau-general/Optional/None';
import { ISO639 } from '../ISO639';
import { Language, LanguageJSON, LanguageRow } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Languages } from '../Languages';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockLanguageName } from '../Mock/MockLanguageName';
import { MockISO639 } from '../Mock/MockISO639';
import { Sequence } from '../../veau-general/Collection/Sequence';

describe('Languages', () => {
  describe('of', () => {
    it('when the Sequence is zero size, returns empty', () => {
      const languages: Languages = Languages.of(Sequence.empty<Language>());

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const sequence: Sequence<MockLanguage> = Sequence.of<Language>([
        language1,
        language2
      ]);

      const languages: Languages = Languages.of(sequence);

      expect(languages.size()).toEqual(sequence.size());
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(i).get()).toEqual(sequence.get(i).get());
      }
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

      expect(languages.size()).toEqual(json.length);
      for (let i: number = 0; i < languages.size(); i++) {
        const language: Language = languages.get(i).get();
        expect(language.getLanguageID().get()).toEqual(json[i].languageID);
        expect(language.getName().get()).toEqual(json[i].name);
        expect(language.getEnglishName().get()).toEqual(json[i].englishName);
        expect(language.getISO639().get()).toEqual(json[i].iso639);
      }
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

      expect(languages.size()).toEqual(rows.length);
      for (let i: number = 0; i < languages.size(); i++) {
        const language: Language = languages.get(i).get();
        expect(language.getLanguageID().get()).toEqual(rows[i].languageID);
        expect(language.getName().get()).toEqual(rows[i].name);
        expect(language.getEnglishName().get()).toEqual(rows[i].englishName);
        expect(language.getISO639().get()).toEqual(rows[i].iso639);
      }
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const langs: Array<MockLanguage> = [
        language1,
        language2
      ];

      const languages: Languages = Languages.ofArray(langs);

      expect(languages.size()).toEqual(langs.length);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(i).get()).toEqual(langs[i]);
      }
    });
  });

  describe('ofSpread', () => {
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

      expect(languages.size()).toEqual(langs.length);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(i).get()).toEqual(langs[i]);
      }
    });
  });

  describe('empty', () => {
    it('generates 0-length Languages', () => {
      expect(Languages.empty().size()).toEqual(0);
    });
  });

  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const languages: Languages = Languages.ofSpread(
        language1,
        language2,
        language3
      );

      expect(languages.size()).toEqual(3);
      expect(languages.get(0).get()).toEqual(language1);
      expect(languages.get(1).get()).toEqual(language2);
      expect(languages.get(2).get()).toEqual(language3);
    });

    it('returns None when the index is out of range', () => {
      const languages: Languages = Languages.empty();

      expect(languages.get(-1)).toBeInstanceOf(None);
      expect(languages.get(0)).toBeInstanceOf(None);
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

      const languages: Languages = Languages.ofSpread(
        language1,
        language2
      );

      expect(languages.contains(language1)).toEqual(true);
      expect(languages.contains(language2)).toEqual(true);
      expect(languages.contains(language3)).toEqual(true);
      expect(languages.contains(language4)).toEqual(false);
    });
  });

  describe('find', () => {
    it('returns Some if the element exists', () => {
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

      const languages: Languages = Languages.ofSpread(
        language1,
        language2
      );

      expect(languages.find((language: Language) => {
        return language1.equals(language);
      }).isPresent()).toEqual(true);
      expect(languages.find((language: Language) => {
        return language2.equals(language);
      }).isPresent()).toEqual(true);
      expect(languages.find((language: Language) => {
        return language3.equals(language);
      }).isPresent()).toEqual(true);
      expect(languages.find((language: Language) => {
        return language4.equals(language);
      }).isPresent()).toEqual(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(2),
        name: new MockLanguageName('language'),
        iso639: new MockISO639('ab')
      });

      const languages1: Languages = Languages.empty();
      const languages2: Languages = Languages.ofSpread(
        language1,
        language2
      );

      expect(languages1.isEmpty()).toEqual(true);
      expect(languages2.isEmpty()).toEqual(false);
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

      const languages1: Languages = Languages.ofSpread(
        language1,
        language2
      );
      const languages2: Languages = Languages.ofSpread(
        language1
      );

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(2),
        name: new MockLanguageName('language'),
        iso639: new MockISO639('ab')
      });

      const languages1: Languages = Languages.ofSpread(
        language1,
        language2
      );
      const languages2: Languages = Languages.ofSpread(
        language2,
        language1
      );

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(2),
        name: new MockLanguageName('language'),
        iso639: new MockISO639('ab')
      });

      const languages1: Languages = Languages.ofSpread(
        language1,
        language2
      );
      const languages2: Languages = Languages.ofSpread(
        language1,
        language2
      );

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language1: Language = Language.of(
        LanguageID.of(1),
        LanguageName.of('language 1'),
        LanguageName.of('english language 1'),
        ISO639.of('aa')
      );

      const languages: Languages = Languages.ofSpread(
        language1
      );

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
      const language1: Language = Language.of(
        LanguageID.of(id1),
        LanguageName.of(name1),
        LanguageName.of(englishName1),
        ISO639.of(iso6391)
      );
      const language2: Language = Language.of(
        LanguageID.of(id2),
        LanguageName.of(name2),
        LanguageName.of(englishName2),
        ISO639.of(iso6392)
      );

      const languages: Languages = Languages.ofSpread(
        language1,
        language2
      );

      expect(languages.toString()).toEqual(`${id1} ${name1} ${englishName1} ${iso6391}, ${id2} ${name2} ${englishName2} ${iso6392}`);
    });
  });
});

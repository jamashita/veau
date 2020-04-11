import { None } from '../../veau-general/Optional/None';
import { ISO639 } from '../ISO639';
import { Language, LanguageJSON, LanguageRow } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Languages } from '../Languages';

// TODO find()
describe('Languages', () => {
  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));
      const language3: Language = Language.of(LanguageID.of(3), LanguageName.of('language 3'), LanguageName.of('english language 3'), ISO639.of('ac'));

      const languages: Languages = Languages.ofArray([
        language1,
        language2,
        language3
      ]);

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
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));
      const language3: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language4: Language = Language.of(LanguageID.of(3), LanguageName.of('language 3'), LanguageName.of('english language 3'), ISO639.of('ac'));

      const languages: Languages = Languages.ofArray([
        language1,
        language2
      ]);

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
      const languages1: Languages = Languages.empty();

      const languages2: Languages = Languages.ofArray([
        language1,
        language2
      ]);

      expect(languages1.isEmpty()).toEqual(true);
      expect(languages2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.ofArray([
        language1,
        language2
      ]);
      const languages2: Languages = Languages.ofArray([
        language1
      ]);

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.ofArray([
        language1,
        language2
      ]);
      const languages2: Languages = Languages.ofArray([
        language2,
        language1
      ]);

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));
      const language2: Language = Language.of(LanguageID.of(2), LanguageName.of('language 2'), LanguageName.of('english language 2'), ISO639.of('ab'));

      const languages1: Languages = Languages.ofArray([
        language1,
        language2
      ]);
      const languages2: Languages = Languages.ofArray([
        language1,
        language2
      ]);

      expect(languages1.equals(languages1)).toEqual(true);
      expect(languages1.equals(languages2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language1: Language = Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english language 1'), ISO639.of('aa'));

      const languages: Languages = Languages.ofArray([
        language1
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
      const language1: Language = Language.of(LanguageID.of(id1), LanguageName.of(name1), LanguageName.of(englishName1), ISO639.of(iso6391));
      const language2: Language = Language.of(LanguageID.of(id2), LanguageName.of(name2), LanguageName.of(englishName2), ISO639.of(iso6392));

      const languages: Languages = Languages.ofArray([
        language1,
        language2
      ]);

      expect(languages.toString()).toEqual(`${id1} ${name1} ${englishName1} ${iso6391}, ${id2} ${name2} ${englishName2} ${iso6392}`);
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
      const language: Language = languages.get(0).get();
      expect(language.getLanguageID().get()).toEqual(json[0].languageID);
      expect(language.getName().get()).toEqual(json[0].name);
      expect(language.getEnglishName().get()).toEqual(json[0].englishName);
      expect(language.getISO639().get()).toEqual(json[0].iso639);
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
      const language: Language = languages.get(0).get();
      expect(language.getLanguageID().get()).toEqual(rows[0].languageID);
      expect(language.getName().get()).toEqual(rows[0].name);
      expect(language.getEnglishName().get()).toEqual(rows[0].englishName);
      expect(language.getISO639().get()).toEqual(rows[0].iso639);
    });
  });

  describe('empty', () => {
    it('generates 0-length Languages', () => {
      expect(Languages.empty().size()).toEqual(0);
    });
  });
});

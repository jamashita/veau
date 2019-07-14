import 'jest';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { Language, LanguageJSON, LanguageRow } from '../Language';

describe('Language', () => {
  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const language1: Language = Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
      const language2: Language = Language.from(LanguageID.of(2), 'Afaraf', 'Afar', ISO639.of('aa'));
      const language3: Language = Language.from(LanguageID.of(1), 'Afaraf', 'Afar', ISO639.of('aa'));

      expect(language1.equals(language1)).toEqual(true);
      expect(language1.equals(language2)).toEqual(false);
      expect(language1.equals(language3)).toEqual(true);
    });
  });

  describe('copy', () => {
    it('every properties are copied', () => {
      const languageID: LanguageID = LanguageID.of(1);
      const name: string = 'аҧсуа бызшәа';
      const englishName: string = 'Abkhazian';
      const iso539: ISO639 = ISO639.of('ab');

      const language: Language = Language.from(languageID, name, englishName, iso539);
      const copied: Language = language.copy();

      expect(language).not.toBe(copied);
      expect(copied.getLanguageID()).toEqual(languageID);
      expect(copied.getName()).toEqual(name);
      expect(copied.getEnglishName()).toEqual(englishName);
      expect(copied.getISO639()).toEqual(iso539);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const language: Language = Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));

      expect(language.toJSON()).toEqual({
        languageID: 1,
        name: 'аҧсуа бызшәа',
        englishName: 'Abkhazian',
        iso639: 'ab'
      });
    });
  });

  describe('from', () => {
    it('normal case', () => {
      const languageID: LanguageID = LanguageID.of(1);
      const name: string = 'Afaraf';
      const englishName: string = 'Afar';
      const iso639: ISO639 = ISO639.of('aa');

      const language: Language = Language.from(languageID, name, englishName, iso639);

      expect(language.getLanguageID()).toEqual(languageID);
      expect(language.getName()).toEqual(name);
      expect(language.getEnglishName()).toEqual(englishName);
      expect(language.getISO639()).toEqual(iso639);
    });
  });

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: LanguageJSON = {
        languageID: 2,
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      const language: Language = Language.fromJSON(json);

      expect(language.getLanguageID().get()).toEqual(json.languageID);
      expect(language.getName()).toEqual(json.name);
      expect(language.getEnglishName()).toEqual(json.englishName);
      expect(language.getISO639().get()).toEqual(json.iso639);
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const row: LanguageRow = {
        languageID: 2,
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      };

      const language: Language = Language.fromRow(row);

      expect(language.getLanguageID().get()).toEqual(row.languageID);
      expect(language.getName()).toEqual(row.name);
      expect(language.getEnglishName()).toEqual(row.englishName);
      expect(language.getISO639().get()).toEqual(row.iso639);
    });
  });
});

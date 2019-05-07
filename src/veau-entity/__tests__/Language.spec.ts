/* tslint:disable */
import 'jest';
import { ISO639 } from '@/veau-vo/ISO639';
import { LanguageID } from '@/veau-vo/LanguageID';
import { Language } from '../Language';

describe('Language', () => {
  it('equals', () => {
    const language1: Language = new Language(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
    const language2: Language = new Language(LanguageID.of(2), 'Afaraf', 'Afar', ISO639.of('aa'));
    const language3: Language = new Language(LanguageID.of(1), 'Afaraf', 'Afar', ISO639.of('aa'));

    expect(language1.equals(language1)).toEqual(true);
    expect(language1.equals(language2)).toEqual(false);
    expect(language1.equals(language3)).toEqual(true);
  });

  it('copy', () => {
    const languageID: LanguageID = LanguageID.of(1);
    const name: string = 'аҧсуа бызшәа';
    const englishName: string = 'Abkhazian';
    const iso539: ISO639 = ISO639.of('ab');

    const language: Language = new Language(languageID, name, englishName, iso539);
    const copied: Language = language.copy();

    expect(copied.getLanguageID()).toEqual(languageID);
    expect(copied.getName()).toEqual(name);
    expect(copied.getEnglishName()).toEqual(englishName);
    expect(copied.getISO639()).toEqual(iso539);
  });

  it('toJSON', () => {
    const language: Language = new Language(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));

    expect(language.toJSON()).toEqual({
      languageID: 1,
      name: 'аҧсуа бызшәа',
      englishName: 'Abkhazian',
      iso639: 'ab'
    });
  });

});

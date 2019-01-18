import 'jest';
import {ISO639} from '../ISO639';
import {Language} from '../Language';
import {LanguageID} from '../LanguageID';

describe('Language', () => {
  it('equals', () => {
    const language1: Language = Language.of(LanguageID.of(1),'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
    const language2: Language = Language.of(LanguageID.of(2),'Afaraf', 'Afar', ISO639.of('aa'));
    const language3: Language = Language.of(LanguageID.of(1),'Afaraf', 'Afar', ISO639.of('aa'));

    expect(language1.equals(language1)).toEqual(true);
    expect(language1.equals(language2)).toEqual(false);
    expect(language1.equals(language3)).toEqual(true);
  });

  it('toJSON', () => {
    const language: Language = Language.of(LanguageID.of(1),'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));;

    expect(language.toJSON()).toEqual({
      languageID: 1,
      name: 'аҧсуа бызшәа',
      englishName: 'Abkhazian',
      iso639: 'ab'
    });
  });
});

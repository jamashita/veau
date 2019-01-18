import 'jest';
import {ISO639} from '../ISO639';
import {Language} from '../Language';

describe('Language', () => {
  it('equals', () => {
    const language1: Language = Language.of('аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
    const language2: Language = Language.of('Afaraf', 'Afar', ISO639.of('aa'));
    const language3: Language = Language.of('Afaraf', 'Afar', ISO639.of('ab'));

    expect(language1.equals(language1)).toEqual(true);
    expect(language1.equals(language2)).toEqual(false);
    expect(language1.equals(language3)).toEqual(true);
  });

  it('toJSON', () => {
    const language: Language = Language.of('аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));;

    expect(language.toJSON()).toEqual({
      name: 'аҧсуа бызшәа',
      englishName: 'Abkhazian',
      iso639: 'ab'
    });
  });
});

import 'jest';
import {ISO639} from '../ISO639';
import {Language} from '../Language';

describe('Language', () => {
  it('equals', () => {
    const language1: Language = new Language('аҧсуа бызшәа', 'Abkhazian', new ISO639('ab'));
    const language2: Language = new Language('Afaraf', 'Afar', new ISO639('aa'));
    const language3: Language = new Language('Afaraf', 'Afar', new ISO639('ab'));

    expect(language1.equals(language1)).toEqual(true);
    expect(language1.equals(language2)).toEqual(false);
    expect(language1.equals(language3)).toEqual(true);
  });

  it('toJSON', () => {
    const language: Language = new Language('аҧсуа бызшәа', 'Abkhazian', new ISO639('ab'));;

    expect(language.toJSON()).toEqual({
      name: 'аҧсуа бызшәа',
      englishName: 'Abkhazian',
      iso639: 'ab'
    });
  });
});

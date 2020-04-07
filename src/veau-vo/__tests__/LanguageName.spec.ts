import { LanguageName } from '../LanguageName';

describe('LanguageName', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const name1: LanguageName = LanguageName.of('language name 1');
      const name2: LanguageName = LanguageName.of('language name 2');
      const name3: LanguageName = LanguageName.of('language name 1');

      expect(name1.equals(name1)).toEqual(true);
      expect(name1.equals(name2)).toEqual(false);
      expect(name1.equals(name3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const name: string = 'language name';
      const languageName: LanguageName = LanguageName.of(name);

      expect(languageName.toString()).toEqual(name);
    });
  });
});

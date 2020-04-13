import { LanguageName } from '../LanguageName';

// DONE
describe('LanguageName', () => {
  describe('empty', () => {
    it('always returns empty string', () => {
      expect(LanguageName.empty().get()).toEqual('');
    });

    it('returns singleton instance', () => {
      expect(LanguageName.empty()).toBe(LanguageName.empty());
    });
  });

  describe('of', () => {
    it('returns LanguageName.empty() when empty string is given', () => {
      expect(LanguageName.of('')).toEqual(LanguageName.empty());
    });

    it('normal case', () => {
      const name1: string = 'language name 1';
      const name2: string = 'language name 2';

      expect(LanguageName.of(name1).get()).toEqual(name1);
      expect(LanguageName.of(name2).get()).toEqual(name2);
    });
  });

  describe('isEmpty', () => {
    it('returns true if LanguageName.empty() is given', () => {
      expect(LanguageName.empty().isEmpty()).toEqual(true);
    });

    it('normal case', () => {
      const name1: string = 'language name 1';
      const name2: string = 'language name 2';

      expect(LanguageName.of(name1).isEmpty()).toEqual(false);
      expect(LanguageName.of(name2).isEmpty()).toEqual(false);
    });
  });

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

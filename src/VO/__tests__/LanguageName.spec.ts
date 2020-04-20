import { LanguageName } from '../LanguageName';

describe('LanguageName', () => {
  describe('empty', () => {
    it('always returns empty string', () => {
      expect(LanguageName.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect(LanguageName.empty()).toBe(LanguageName.empty());
    });
  });

  describe('of', () => {
    it('returns LanguageName.empty() when empty string is given', () => {
      expect(LanguageName.of('')).toBe(LanguageName.empty());
    });

    it('normal case', () => {
      const name1: string = 'language name 1';
      const name2: string = 'language name 2';

      expect(LanguageName.of(name1).get()).toBe(name1);
      expect(LanguageName.of(name2).get()).toBe(name2);
    });
  });

  describe('isEmpty', () => {
    it('returns true if LanguageName.empty() is given', () => {
      expect(LanguageName.empty().isEmpty()).toBe(true);
    });

    it('normal case', () => {
      const name1: string = 'language name 1';
      const name2: string = 'language name 2';

      expect(LanguageName.of(name1).isEmpty()).toBe(false);
      expect(LanguageName.of(name2).isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const name1: LanguageName = LanguageName.of('language name 1');
      const name2: LanguageName = LanguageName.of('language name 2');
      const name3: LanguageName = LanguageName.of('language name 1');

      expect(name1.equals(name1)).toBe(true);
      expect(name1.equals(name2)).toBe(false);
      expect(name1.equals(name3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const name: string = 'language name';
      const languageName: LanguageName = LanguageName.of(name);

      expect(languageName.toString()).toBe(name);
    });
  });
});

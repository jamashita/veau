import { ISO639 } from '../ISO639';

describe('ISO639', () => {
  describe('empty', () => {
    it('always returns empty string', () => {
      expect(ISO639.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect(ISO639.empty()).toBe(ISO639.empty());
    });
  });

  describe('of', () => {
    it('returns ISO639.empty() when empty string is given', () => {
      expect(ISO639.of('')).toBe(ISO639.empty());
    });

    it('normal case', () => {
      const iso6391: string = 'ab';
      const iso6392: string = 'aa';

      expect(ISO639.of(iso6391).get()).toBe(iso6391);
      expect(ISO639.of(iso6392).get()).toBe(iso6392);
    });
  });

  describe('isEmpty', () => {
    it('returns true when ISO639.empty() is given', () => {
      expect(ISO639.empty().isEmpty()).toBe(true);
    });

    it('normal case', () => {
      const iso6391: string = 'ab';
      const iso6392: string = 'aa';

      expect(ISO639.of(iso6391).isEmpty()).toBe(false);
      expect(ISO639.of(iso6392).isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const iso639: ISO639 = ISO639.of('ab');

      expect(iso639.equals(null)).toBe(false);
      expect(iso639.equals(undefined)).toBe(false);
      expect(iso639.equals('')).toBe(false);
      expect(iso639.equals('123')).toBe(false);
      expect(iso639.equals('abcd')).toBe(false);
      expect(iso639.equals(123)).toBe(false);
      expect(iso639.equals(0)).toBe(false);
      expect(iso639.equals(-12)).toBe(false);
      expect(iso639.equals(0.3)).toBe(false);
      expect(iso639.equals(false)).toBe(false);
      expect(iso639.equals(true)).toBe(false);
      expect(iso639.equals(Symbol('p'))).toBe(false);
      expect(iso639.equals(20n)).toBe(false);
      expect(iso639.equals({})).toBe(false);
      expect(iso639.equals([])).toBe(false);
      expect(iso639.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the property is the same', () => {
      const iso6391: ISO639 = ISO639.of('ab');
      const iso6392: ISO639 = ISO639.of('aa');
      const iso6393: ISO639 = ISO639.of('ab');

      expect(iso6391.equals(iso6391)).toBe(true);
      expect(iso6391.equals(iso6392)).toBe(false);
      expect(iso6391.equals(iso6393)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const code: string = 'ab';
      const iso639: ISO639 = ISO639.of(code);

      expect(iso639.toString()).toBe(code);
    });
  });
});

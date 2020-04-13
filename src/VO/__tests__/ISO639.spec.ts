import { ISO639 } from '../ISO639';

// DONE
describe('ISO639', () => {
  describe('default', () => {
    it('always returns empty string', () => {
      expect(ISO639.default().get()).toEqual('');
    });

    it('returns singleton instance', () => {
      expect(ISO639.default()).toBe(ISO639.default());
    });
  });

  describe('of', () => {
    it('returns ISO639.default() when empty string is given', () => {
      expect(ISO639.of('')).toBe(ISO639.default());
    });

    it('normal case', () => {
      const iso6391: string = 'ab';
      const iso6392: string = 'aa';

      expect(ISO639.of(iso6391).get()).toBe(iso6391);
      expect(ISO639.of(iso6392).get()).toBe(iso6392);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const iso6391: ISO639 = ISO639.of('ab');
      const iso6392: ISO639 = ISO639.of('aa');
      const iso6393: ISO639 = ISO639.of('ab');

      expect(iso6391.equals(iso6391)).toEqual(true);
      expect(iso6391.equals(iso6392)).toEqual(false);
      expect(iso6391.equals(iso6393)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const code: string = 'ab';
      const iso639: ISO639 = ISO639.of(code);

      expect(iso639.toString()).toEqual(code);
    });
  });
});

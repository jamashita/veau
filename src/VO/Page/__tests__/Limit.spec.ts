import { PageError } from '../Error/PageError';
import { Limit } from '../Limit';

describe('Limit', () => {
  describe('default', () => {
    it('always returns 40', () => {
      expect.assertions(1);

      expect(Limit.default().get()).toBe(40);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Limit.default()).toBe(Limit.default());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 1', () => {
      expect.assertions(2);

      expect(() => {
        Limit.of(0);
      }).toThrow(PageError);
      expect(() => {
        Limit.of(-1);
      }).toThrow(PageError);
    });

    it('returns Dead when the argument is not integer', () => {
      expect.assertions(2);

      expect(() => {
        Limit.of(1.1);
      }).toThrow(PageError);
      expect(() => {
        Limit.of(0.2);
      }).toThrow(PageError);
    });

    it('returns Alive and its value is Limit.default() when the argument 0', () => {
      expect.assertions(1);

      const limit: Limit = Limit.of(40);

      expect(limit).toBe(Limit.default());
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const limit1: Limit = Limit.of(1);
      const limit2: Limit = Limit.of(2);
      const limit3: Limit = Limit.of(1);

      expect(limit1.equals(limit1)).toBe(true);
      expect(limit1.equals(limit2)).toBe(false);
      expect(limit1.equals(limit3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const num: number = 1;
      const limit: Limit = Limit.of(num);

      expect(limit.toString()).toBe(num.toString());
    });
  });
});

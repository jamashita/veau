import { PageError } from '../Error/PageError';
import { Offset } from '../Offset';

describe('Offset', () => {
  describe('of', () => {
    it('returns Dead when the argument is less than 0', () => {
      expect.assertions(2);

      expect(() => {
        Offset.of(-1);
      }).toThrow(PageError);
      expect(() => {
        Offset.of(-2);
      }).toThrow(PageError);
    });

    it('returns Dead when the argument is not integer', () => {
      expect.assertions(2);

      expect(() => {
        Offset.of(0.1);
      }).toThrow(PageError);
      expect(() => {
        Offset.of(1.5);
      }).toThrow(PageError);
    });
  });

  describe('equals', () => {
    it('returns true i f both properties are the same', () => {
      expect.assertions(3);

      const offset1: Offset = Offset.of(1);
      const offset2: Offset = Offset.of(2);
      const offset3: Offset = Offset.of(1);

      expect(offset1.equals(offset1)).toBe(true);
      expect(offset1.equals(offset2)).toBe(false);
      expect(offset1.equals(offset3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const num: number = 2;
      const offset: Offset = Offset.of(num);

      expect(offset.toString()).toBe(num.toString());
    });
  });
});

import 'jest';
import { LimitError } from '../../veau-error/LimitError';
import { Limit } from '../Limit';

describe('Limit', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const limit1: Limit = Limit.of(1);
      const limit2: Limit = Limit.of(2);
      const limit3: Limit = Limit.of(1);

      expect(limit1.equals(limit1)).toEqual(true);
      expect(limit1.equals(limit2)).toEqual(false);
      expect(limit1.equals(limit3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 1;
      const limit: Limit = Limit.of(num);

      expect(limit.toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws LimitError when the argument is less than 1', () => {
      expect(() => {
        Limit.of(1);
      }).not.toThrow(LimitError);
      expect(() => {
        Limit.of(0);
      }).toThrow(LimitError);
      expect(() => {
        Limit.of(-1);
      }).toThrow(LimitError);
    });

    it('throws LimitError when the argument is not integer', () => {
      expect(() => {
        Limit.of(1.1);
      }).toThrow(LimitError);
      expect(() => {
        Limit.of(0.2);
      }).toThrow(LimitError);
    });
  });
});

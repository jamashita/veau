import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
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

  describe('of', () => {
    it('throws RuntimeError when the argument is less than 1', () => {
      expect(() => {
        Limit.of(1);
      }).not.toThrow(RuntimeError);
      expect(() => {
        Limit.of(0);
      }).toThrow(RuntimeError);
      expect(() => {
        Limit.of(-1);
      }).toThrow(RuntimeError);
    });
  });
});

import { INumericalValue } from '../INumericalValue';
import { NoValue } from '../NoValue';
import { NumericalValue } from '../NumericalValue';

describe('NumericalValue', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(4);

      const value1: INumericalValue = NumericalValue.of(3);
      const value2: INumericalValue = NumericalValue.of(5);
      const value3: INumericalValue = NumericalValue.of(3);
      const value4: INumericalValue = NoValue.of();

      expect(value1.equals(value1)).toBe(true);
      expect(value1.equals(value2)).toBe(false);
      expect(value1.equals(value3)).toBe(true);
      expect(value1.equals(value4)).toBe(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const num: number = 4;
      const value: NumericalValue = NumericalValue.of(num);

      expect(value.toString()).toBe(num.toString());
    });
  });
});

import { NumericalValue } from '../NumericalValue';

describe('NumericalValue', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const value1: NumericalValue = NumericalValue.of(3);
      const value2: NumericalValue = NumericalValue.of(5);
      const value3: NumericalValue = NumericalValue.of(3);

      expect(value1.equals(value1)).toBe(true);
      expect(value1.equals(value2)).toBe(false);
      expect(value1.equals(value3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 4;
      const value: NumericalValue = NumericalValue.of(num);

      expect(value.toString()).toBe(num.toString());
    });
  });
});

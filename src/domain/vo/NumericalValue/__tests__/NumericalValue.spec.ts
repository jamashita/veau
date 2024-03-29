import { NumericalValue } from '../NumericalValue';

describe('NumericalValue', () => {
  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const value: NumericalValue = NumericalValue.of(-1);

      expect(value.equals(null)).toBe(false);
      expect(value.equals(undefined)).toBe(false);
      expect(value.equals('')).toBe(false);
      expect(value.equals('123')).toBe(false);
      expect(value.equals('abcd')).toBe(false);
      expect(value.equals(123)).toBe(false);
      expect(value.equals(0)).toBe(false);
      expect(value.equals(-12)).toBe(false);
      expect(value.equals(0.3)).toBe(false);
      expect(value.equals(false)).toBe(false);
      expect(value.equals(true)).toBe(false);
      expect(value.equals(Symbol('p'))).toBe(false);
      expect(value.equals(20n)).toBe(false);
      expect(value.equals({})).toBe(false);
      expect(value.equals([])).toBe(false);
      expect(value.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      expect.assertions(3);

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
      expect.assertions(1);

      const num: number = 4;
      const value: NumericalValue = NumericalValue.of(num);

      expect(value.toString()).toBe(num.toString());
    });
  });
});

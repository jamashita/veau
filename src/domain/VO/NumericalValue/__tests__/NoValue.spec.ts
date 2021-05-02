import { NumericalValueError } from '../Error/NumericalValueError';
import { NoValue } from '../NoValue';
import { NumericalValue } from '../NumericalValue';

describe('NoValue', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(NoValue.of()).toBe(NoValue.of());
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const value: NoValue = NoValue.of();

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

    it('returns true if the object is NoValue', () => {
      expect.assertions(4);

      const value1: NumericalValue = NoValue.of();
      const value2: NumericalValue = NumericalValue.of(0);
      const value3: NumericalValue = NumericalValue.of(NaN);
      const value4: NumericalValue = NoValue.of();

      expect(value1.equals(value1)).toBe(true);
      expect(value1.equals(value2)).toBe(false);
      expect(value1.equals(value3)).toBe(false);
      expect(value1.equals(value4)).toBe(true);
    });
  });

  describe('get', () => {
    it('definitely throws NumericalValueError', () => {
      expect.assertions(1);

      expect(() => {
        NoValue.of().get();
      }).toThrow(NumericalValueError);
    });
  });

  describe('toString', () => {
    it('returns empty string', () => {
      expect.assertions(1);

      const value: NoValue = NoValue.of();

      expect(value.toString()).toBe('');
    });
  });
});

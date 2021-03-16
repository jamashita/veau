import { NumericalValueError } from '../Error/NumericalValueError';
import { NoValue } from '../NoValue';
import { NumericalValue } from '../NumericalValue';
import { ValueContained } from '../ValueContained';

describe('NoValue', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(NoValue.of()).toBe(NoValue.of());
    });
  });

  describe('equals', () => {
    it('returns true if the object is NoValue', () => {
      expect.assertions(4);

      const value1: NumericalValue = NoValue.of();
      const value2: NumericalValue = ValueContained.of(0);
      const value3: NumericalValue = ValueContained.of(1);
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

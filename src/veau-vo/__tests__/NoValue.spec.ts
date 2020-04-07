import { NumericalValueError } from '../../veau-error/NumericalValueError';
import { NoValue } from '../NoValue';
import { NumericalValue } from '../NumericalValue';

describe('NoValue', () => {
  describe('equals', () => {
    it('returns true if the object is NoValue', () => {
      const value1: NumericalValue = NoValue.of();
      const value2: NumericalValue = NumericalValue.of(0);
      const value3: NumericalValue = NumericalValue.of(1);
      const value4: NumericalValue = NoValue.of();

      expect(value1.equals(value1)).toEqual(true);
      expect(value1.equals(value2)).toEqual(false);
      expect(value1.equals(value3)).toEqual(false);
      expect(value1.equals(value4)).toEqual(true);
    });
  });

  describe('get', () => {
    it('definitely throws NumericalValueError', () => {
      expect(() => {
        NoValue.of().get();
      }).toThrow(NumericalValueError);
    });
  });

  describe('toString', () => {
    it('returns empty string', () => {
      const value: NoValue = NoValue.of();

      expect(value.toString()).toEqual('');
    });
  });
});

import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
import { AsOf } from '../AsOf';

describe('AsOf', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01 00:00:00');
      const asOf2: AsOf = AsOf.ofString('2000-01-02 00:00:00');
      const asOf3: AsOf = AsOf.ofString('2000-01-01 00:00:00');

      expect(asOf1.equals(asOf1)).toEqual(true);
      expect(asOf1.equals(asOf2)).toEqual(false);
      expect(asOf1.equals(asOf3)).toEqual(true);
    });
  });

  describe('getString', () => {
    it('normal case', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');

      expect(asOf.getString()).toEqual('2000-01-01');
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect(() => {
        AsOf.ofString('2000-01-01');
      }).not.toThrow(RuntimeError);

      expect(() => {
        AsOf.ofString('2000-01-01 00:00:00');
      }).not.toThrow(RuntimeError);
    });

    it('will throw RuntimeError because the string format is not compatible to date time', () => {
      expect(() => {
        AsOf.ofString('deux mille');
      }).toThrow(RuntimeError);

      expect(() => {
        AsOf.ofString('dos mil');
      }).toThrow(RuntimeError);
    });
  });
});

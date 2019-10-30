import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
import { Row } from '../Row';

describe('Row', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const row1: Row = Row.of(1);
      const row2: Row = Row.of(2);
      const row3: Row = Row.of(1);

      expect(row1.equals(row1)).toEqual(true);
      expect(row1.equals(row2)).toEqual(false);
      expect(row1.equals(row3)).toEqual(true);
    });
  });

  describe('of', () => {
    it('throws RuntimeError when the argument is less than 0', () => {
      expect(() => {
        Row.of(0);
      }).not.toThrow(RuntimeError);
      expect(() => {
        Row.of(-1);
      }).toThrow(RuntimeError);
    });

    it('throw RuntimeError when the argument is not integer', () => {
      expect(() => {
        Row.of(0.1);
      }).toThrow(RuntimeError);
      expect(() => {
        Row.of(1.5);
      }).toThrow(RuntimeError);
    });
  });
});

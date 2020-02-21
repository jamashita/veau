import 'jest';
import { RowError } from '../../veau-error/RowError';
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

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const row: Row = Row.of(num);

      expect(row.toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws RowError when the argument is less than 0', () => {
      expect(() => {
        Row.of(0);
      }).not.toThrow(RowError);
      expect(() => {
        Row.of(-1);
      }).toThrow(RowError);
    });

    it('throw RowError when the argument is not integer', () => {
      expect(() => {
        Row.of(0.1);
      }).toThrow(RowError);
      expect(() => {
        Row.of(1.5);
      }).toThrow(RowError);
    });
  });

  describe('default', () => {
    it('always gives 0 value', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(Row.default().get()).toEqual(0);
      }
    });
  });
});

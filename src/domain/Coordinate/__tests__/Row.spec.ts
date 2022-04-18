import { CoordinateError } from '../CoordinateError';
import { Row } from '../Row';

describe('Row', () => {
  describe('origin', () => {
    it('always returns 0', () => {
      expect(Row.origin().get()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(Row.origin()).toBe(Row.origin());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 0', () => {
      expect(() => {
        Row.of(-1);
      }).toThrow(CoordinateError);
      expect(() => {
        Row.of(-2.1);
      }).toThrow(CoordinateError);
    });

    it('returns Alive and its value is Row.origin() when the argument 0', () => {
      const row: Row = Row.of(0);

      expect(row).toBe(Row.origin());
    });

    it('returns Dead when the argument is not integer', () => {
      expect(() => {
        Row.of(0.1);
      }).toThrow(CoordinateError);
      expect(() => {
        Row.of(1.5);
      }).toThrow(CoordinateError);
    });

    it('returns Alive when the argument is positive and integer', () => {
      const value1: number = 31;
      const value2: number = 101;
      const row1: Row = Row.of(value1);
      const row2: Row = Row.of(value2);

      expect(row1.get()).toBe(value1);
      expect(row2.get()).toBe(value2);
    });
  });

  describe('isOrigin', () => {
    it('row.origin() returns true', () => {
      expect(Row.origin().isOrigin()).toBe(true);
    });

    it('returns true when the value is 0, otherwise returns false', () => {
      const row1: Row = Row.of(0);
      const row2: Row = Row.of(1);
      const row3: Row = Row.of(2);

      expect(row1.isOrigin()).toBe(true);
      expect(row2.isOrigin()).toBe(false);
      expect(row3.isOrigin()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const row: Row = Row.origin();

      expect(row.equals(null)).toBe(false);
      expect(row.equals(undefined)).toBe(false);
      expect(row.equals('')).toBe(false);
      expect(row.equals('123')).toBe(false);
      expect(row.equals('abcd')).toBe(false);
      expect(row.equals(123)).toBe(false);
      expect(row.equals(0)).toBe(false);
      expect(row.equals(-12)).toBe(false);
      expect(row.equals(0.3)).toBe(false);
      expect(row.equals(false)).toBe(false);
      expect(row.equals(true)).toBe(false);
      expect(row.equals(Symbol('p'))).toBe(false);
      expect(row.equals(20n)).toBe(false);
      expect(row.equals({})).toBe(false);
      expect(row.equals([])).toBe(false);
      expect(row.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      const row1: Row = Row.of(1);
      const row2: Row = Row.of(2);
      const row3: Row = Row.of(1);

      expect(row1.equals(row1)).toBe(true);
      expect(row1.equals(row2)).toBe(false);
      expect(row1.equals(row3)).toBe(true);
    });
  });
});

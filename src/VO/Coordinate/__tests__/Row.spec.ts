import { RowError } from '../Error/RowError';
import { Row } from '../Row';

describe('Row', () => {
  describe('origin', () => {
    it('always returns 0', () => {
      expect.assertions(1);

      expect(Row.origin().get()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Row.origin()).toBe(Row.origin());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 0', () => {
      expect.assertions(2);

      expect(() => {
        Row.of(-1);
      }).toThrow(RowError);
      expect(() => {
        Row.of(-2.1);
      }).toThrow(RowError);
    });

    it('returns Alive and its value is Row.origin() when the argument 0', () => {
      expect.assertions(1);

      const row: Row = Row.of(0);

      expect(row).toBe(Row.origin());
    });

    it('returns Dead when the argument is not integer', () => {
      expect.assertions(2);

      expect(() => {
        Row.of(0.1);
      }).toThrow(RowError);
      expect(() => {
        Row.of(1.5);
      }).toThrow(RowError);
    });

    it('returns Alive when the argument is positive and integer', () => {
      expect.assertions(2);

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
      expect.assertions(1);

      expect(Row.origin().isOrigin()).toBe(true);
    });

    it('returns true when the value is 0, otherwise returns false', () => {
      expect.assertions(3);

      const row1: Row = Row.of(0);
      const row2: Row = Row.of(1);
      const row3: Row = Row.of(2);

      expect(row1.isOrigin()).toBe(true);
      expect(row2.isOrigin()).toBe(false);
      expect(row3.isOrigin()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const row1: Row = Row.of(1);
      const row2: Row = Row.of(2);
      const row3: Row = Row.of(1);

      expect(row1.equals(row1)).toBe(true);
      expect(row1.equals(row2)).toBe(false);
      expect(row1.equals(row3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const num: number = 2;
      const row: Row = Row.of(num);

      expect(row.toString()).toBe(num.toString());
    });
  });
});

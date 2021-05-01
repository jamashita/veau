import { Column } from '../Column';
import { ColumnError } from '../Error/ColumnError';

describe('Column', () => {
  describe('origin', () => {
    it('always returns 0', () => {
      expect.assertions(1);

      expect(Column.origin().get()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Column.origin()).toBe(Column.origin());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 0', () => {
      expect.assertions(2);

      expect(() => {
        Column.of(-1);
      }).toThrow(ColumnError);
      expect(() => {
        Column.of(-2.1);
      }).toThrow(ColumnError);
    });

    it('returns Alive and its value is Column.origin() when the argument 0', () => {
      expect.assertions(1);

      const column: Column = Column.of(0);

      expect(column).toBe(Column.origin());
    });

    it('returns Dead when the argument is not integer', () => {
      expect.assertions(2);

      expect(() => {
        Column.of(0.1);
      }).toThrow(ColumnError);
      expect(() => {
        Column.of(1.5);
      }).toThrow(ColumnError);
    });

    it('returns Alive when the argument is positive and integer', () => {
      expect.assertions(2);

      const value1: number = 31;
      const value2: number = 101;
      const column1: Column = Column.of(value1);
      const column2: Column = Column.of(value2);

      expect(column1.get()).toBe(value1);
      expect(column2.get()).toBe(value2);
    });
  });

  describe('isOrigin', () => {
    it('column.origin() returns true', () => {
      expect.assertions(1);

      expect(Column.origin().isOrigin()).toBe(true);
    });

    it('returns true when the value is 0, otherwise returns false', () => {
      expect.assertions(3);

      const column1: Column = Column.of(0);
      const column2: Column = Column.of(1);
      const column3: Column = Column.of(2);

      expect(column1.isOrigin()).toBe(true);
      expect(column2.isOrigin()).toBe(false);
      expect(column3.isOrigin()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const column: Column = Column.origin();

      expect(column.equals(null)).toBe(false);
      expect(column.equals(undefined)).toBe(false);
      expect(column.equals('')).toBe(false);
      expect(column.equals('123')).toBe(false);
      expect(column.equals('abcd')).toBe(false);
      expect(column.equals(123)).toBe(false);
      expect(column.equals(0)).toBe(false);
      expect(column.equals(-12)).toBe(false);
      expect(column.equals(0.3)).toBe(false);
      expect(column.equals(false)).toBe(false);
      expect(column.equals(true)).toBe(false);
      expect(column.equals(Symbol('p'))).toBe(false);
      expect(column.equals(20n)).toBe(false);
      expect(column.equals({})).toBe(false);
      expect(column.equals([])).toBe(false);
      expect(column.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const column1: Column = Column.of(1);
      const column2: Column = Column.of(2);
      const column3: Column = Column.of(1);

      expect(column1.equals(column1)).toBe(true);
      expect(column1.equals(column2)).toBe(false);
      expect(column1.equals(column3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const num: number = 1231;
      const column: Column = Column.of(num);

      expect(column.toString()).toBe(num.toString());
    });
  });
});

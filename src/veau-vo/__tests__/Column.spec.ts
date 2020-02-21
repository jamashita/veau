import 'jest';
import { ColumnError } from '../../veau-error/ColumnError';
import { Column } from '../Column';

describe('Column', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const column1: Column = Column.of(1);
      const column2: Column = Column.of(2);
      const column3: Column = Column.of(1);

      expect(column1.equals(column1)).toEqual(true);
      expect(column1.equals(column2)).toEqual(false);
      expect(column1.equals(column3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 1231;
      const column: Column = Column.of(num);

      expect(column.toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws ColumnError when the argument is less than 0', () => {
      expect(() => {
        Column.of(0);
      }).not.toThrow(ColumnError);
      expect(() => {
        Column.of(-1);
      }).toThrow(ColumnError);
    });

    it('throws ColumnError when the argument is not integer', () => {
      expect(() => {
        Column.of(0.1);
      }).toThrow(ColumnError);
      expect(() => {
        Column.of(1.5);
      }).toThrow(ColumnError);
    });
  });
});

import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
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

  describe('of', () => {
    it('throws RuntimeError when the argument is less than 0', () => {
      expect(() => {
        Column.of(0);
      }).not.toThrow(RuntimeError);
      expect(() => {
        Column.of(-1);
      }).toThrow(RuntimeError);
    });

    it('throws RuntimeError when the argument is less than 0', () => {
      expect(() => {
        Column.of(0.1);
      }).toThrow(RuntimeError);
      expect(() => {
        Column.of(1.5);
      }).toThrow(RuntimeError);
    });
  });
});

import { Column } from '../Column';
import { Coordinate } from '../Coordinate';
import { Row } from '../Row';

describe('Coordinate', () => {
  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const coordinate: Coordinate = Coordinate.of(Row.origin(), Column.origin());

      expect(coordinate.equals(null)).toBe(false);
      expect(coordinate.equals(undefined)).toBe(false);
      expect(coordinate.equals('')).toBe(false);
      expect(coordinate.equals('123')).toBe(false);
      expect(coordinate.equals('abcd')).toBe(false);
      expect(coordinate.equals(123)).toBe(false);
      expect(coordinate.equals(0)).toBe(false);
      expect(coordinate.equals(-12)).toBe(false);
      expect(coordinate.equals(0.3)).toBe(false);
      expect(coordinate.equals(false)).toBe(false);
      expect(coordinate.equals(true)).toBe(false);
      expect(coordinate.equals(Symbol('p'))).toBe(false);
      expect(coordinate.equals(20n)).toBe(false);
      expect(coordinate.equals({})).toBe(false);
      expect(coordinate.equals([])).toBe(false);
      expect(coordinate.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the all properties are the same', () => {
      expect.assertions(5);

      const coordinate1: Coordinate = Coordinate.of(Row.of(1), Column.of(2));
      const coordinate2: Coordinate = Coordinate.of(Row.of(2), Column.of(2));
      const coordinate3: Coordinate = Coordinate.of(Row.of(1), Column.of(1));
      const coordinate4: Coordinate = Coordinate.of(Row.of(2), Column.of(2));
      const coordinate5: Coordinate = Coordinate.of(Row.of(1), Column.of(2));

      expect(coordinate1.equals(coordinate1)).toBe(true);
      expect(coordinate1.equals(coordinate2)).toBe(false);
      expect(coordinate1.equals(coordinate3)).toBe(false);
      expect(coordinate1.equals(coordinate4)).toBe(false);
      expect(coordinate1.equals(coordinate5)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const row: number = 1;
      const column: number = 2;
      const coordinate: Coordinate = Coordinate.of(Row.of(row), Column.of(column));

      expect(coordinate.toString()).toBe(`${row} ${column}`);
    });
  });
});

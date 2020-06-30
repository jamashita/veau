import { Column } from '../Column';
import { Coordinate } from '../Coordinate';
import { MockColumn } from '../Mock/MockColumn';
import { MockRow } from '../Mock/MockRow';
import { Row } from '../Row';

describe('Coordinate', () => {
  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const coordinate1: Coordinate = Coordinate.of(new MockRow(1), new MockColumn(2));
      const coordinate2: Coordinate = Coordinate.of(new MockRow(2), new MockColumn(2));
      const coordinate3: Coordinate = Coordinate.of(new MockRow(1), new MockColumn(1));
      const coordinate4: Coordinate = Coordinate.of(new MockRow(2), new MockColumn(2));
      const coordinate5: Coordinate = Coordinate.of(new MockRow(1), new MockColumn(2));

      expect(coordinate1.equals(coordinate1)).toBe(true);
      expect(coordinate1.equals(coordinate2)).toBe(false);
      expect(coordinate1.equals(coordinate3)).toBe(false);
      expect(coordinate1.equals(coordinate4)).toBe(false);
      expect(coordinate1.equals(coordinate5)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', async () => {
      const row: number = 1;
      const column: number = 2;
      const coordinate: Coordinate = Coordinate.of(await Row.of(row).get(), await Column.of(column).get());

      expect(coordinate.toString()).toBe(`${row} ${column}`);
    });
  });
});

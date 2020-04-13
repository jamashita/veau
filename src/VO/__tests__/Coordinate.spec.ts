import { Column } from '../Column';
import { Coordinate } from '../Coordinate';
import { Row } from '../Row';
import { MockRow } from '../Mock/MockRow';
import { MockColumn } from '../Mock/MockColumn';

// DONE
describe('Coordinate', () => {
  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const coordinate1: Coordinate = Coordinate.of(
        new MockRow(1),
        new MockColumn(2)
      );
      const coordinate2: Coordinate = Coordinate.of(
        new MockRow(2),
        new MockColumn(2)
      );
      const coordinate3: Coordinate = Coordinate.of(
        new MockRow(1),
        new MockColumn(1)
      );
      const coordinate4: Coordinate = Coordinate.of(
        new MockRow(2),
        new MockColumn(2)
      );
      const coordinate5: Coordinate = Coordinate.of(
        new MockRow(1),
        new MockColumn(2)
      );

      expect(coordinate1.equals(coordinate1)).toEqual(true);
      expect(coordinate1.equals(coordinate2)).toEqual(false);
      expect(coordinate1.equals(coordinate3)).toEqual(false);
      expect(coordinate1.equals(coordinate4)).toEqual(false);
      expect(coordinate1.equals(coordinate5)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const row: number = 1;
      const column: number = 2;
      const coordinate: Coordinate = Coordinate.of(
        Row.of(row).get(),
        Column.of(column).get()
      );

      expect(coordinate.toString()).toEqual(`${row} ${column}`);
    });
  });
});

import 'jest';
import { Column } from '../Column';
import { Coordinate } from '../Coordinate';
import { Row } from '../Row';

describe('Coordinate', () => {
  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const coordinate1: Coordinate = Coordinate.of(Row.of(1), Column.of(2));
      const coordinate2: Coordinate = Coordinate.of(Row.of(2), Column.of(2));
      const coordinate3: Coordinate = Coordinate.of(Row.of(1), Column.of(1));
      const coordinate4: Coordinate = Coordinate.of(Row.of(2), Column.of(2));
      const coordinate5: Coordinate = Coordinate.of(Row.of(1), Column.of(2));

      expect(coordinate1.equals(coordinate1)).toEqual(true);
      expect(coordinate1.equals(coordinate2)).toEqual(false);
      expect(coordinate1.equals(coordinate3)).toEqual(false);
      expect(coordinate1.equals(coordinate4)).toEqual(false);
      expect(coordinate1.equals(coordinate5)).toEqual(true);
    });
  });
});

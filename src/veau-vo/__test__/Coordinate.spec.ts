import 'jest';
import { Coordinate } from '../Coordinate';

describe('Coordinate', () => {
  it('equals: number', () => {
    const coordinate1: Coordinate = Coordinate.of(0, 0);
    const coordinate2: Coordinate = Coordinate.of(0, 1);
    const coordinate3: Coordinate = Coordinate.of(1, 0);
    const coordinate4: Coordinate = Coordinate.of(1, 1);
    const coordinate5: Coordinate = Coordinate.of(0, 0);

    expect(coordinate1.equals(coordinate1)).toEqual(true);
    expect(coordinate1.equals(coordinate2)).toEqual(false);
    expect(coordinate1.equals(coordinate3)).toEqual(false);
    expect(coordinate1.equals(coordinate4)).toEqual(false);
    expect(coordinate1.equals(coordinate5)).toEqual(true);
  });


  it('equals: number', () => {
    const coordinate1: Coordinate = Coordinate.of('c1', 0);
    const coordinate2: Coordinate = Coordinate.of('c1', 1);
    const coordinate3: Coordinate = Coordinate.of('c2', 0);
    const coordinate4: Coordinate = Coordinate.of('c2', 1);
    const coordinate5: Coordinate = Coordinate.of('c1', 0);

    expect(coordinate1.equals(coordinate1)).toEqual(true);
    expect(coordinate1.equals(coordinate2)).toEqual(false);
    expect(coordinate1.equals(coordinate3)).toEqual(false);
    expect(coordinate1.equals(coordinate4)).toEqual(false);
    expect(coordinate1.equals(coordinate5)).toEqual(true);
  });

  it('toJSON', () => {
    const coordinate: Coordinate = Coordinate.of(100, 90);

    expect(coordinate.toJSON()).toEqual({
      x: 100,
      y: 90
    });
  });
});

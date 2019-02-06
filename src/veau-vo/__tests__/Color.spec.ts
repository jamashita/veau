/* tslint:disable */
import 'jest'
import { Color } from '../Color';

describe('Color', () => {
  it('equals', () => {
    const color1: Color = Color.of(1, 2, 3);
    const color2: Color = Color.of(4, 2, 3);
    const color3: Color = Color.of(1, 5, 3);
    const color4: Color = Color.of(1, 2, 6);
    const color5: Color = Color.of(4, 5, 3);
    const color6: Color = Color.of(1, 5, 6);
    const color7: Color = Color.of(4, 2, 6);
    const color8: Color = Color.of(4, 5, 6);
    const color9: Color = Color.of(1, 2, 3);

    expect(color1.equals(color1)).toEqual(true);
    expect(color1.equals(color2)).toEqual(false);
    expect(color1.equals(color3)).toEqual(false);
    expect(color1.equals(color4)).toEqual(false);
    expect(color1.equals(color5)).toEqual(false);
    expect(color1.equals(color6)).toEqual(false);
    expect(color1.equals(color7)).toEqual(false);
    expect(color1.equals(color8)).toEqual(false);
    expect(color1.equals(color9)).toEqual(true);
  });
});

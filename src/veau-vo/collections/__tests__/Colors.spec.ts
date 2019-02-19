/* tslint:disable */
import 'jest';
import { Color } from '../../Color';
import { Colors } from '../Colors';

describe('Colors', () => {
  it('get', () => {
    const colors: Colors = Colors.of([
      Color.of('#ffffff'),
      Color.of('#000000')
    ]);

    expect(colors.get(0).toString()).toEqual('#ffffff');
    expect(colors.get(1).toString()).toEqual('#000000');
    expect(colors.get(2).toString()).toEqual('#ffffff');
  });
});

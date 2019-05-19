/* tslint:disable */
import 'jest';
import { Color } from '../../veau-vo/Color';
import { Colors } from '../Colors';

describe('Colors', () => {
  describe('get', () => {
    it('when index is over the length of Colors, loops and returns the element from first', () => {
      const colors: Colors = Colors.of([
        Color.of('#ffffff'),
        Color.of('#000000')
      ]);

      expect(colors.get(0).toString()).toEqual('#ffffff');
      expect(colors.get(1).toString()).toEqual('#000000');
      expect(colors.get(2).toString()).toEqual('#ffffff');
    });
  });
});

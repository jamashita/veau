import { Color } from '../Color';
import { Colors } from '../Colors';

describe('Colors', () => {
  describe('get', () => {
    it('when index is over the length of Colors, loops and returns the element of first', () => {
      const colors: Colors = Colors.ofArray([
        Color.of('#ffffff'),
        Color.of('#000000')
      ]);

      expect(colors.get(0).get().toString()).toEqual('#ffffff');
      expect(colors.get(1).get().toString()).toEqual('#000000');
      expect(colors.get(2).get().toString()).toEqual('#ffffff');
      expect(colors.get(3).get().toString()).toEqual('#000000');
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Colors', () => {
      const color1: Color = Color.of('#ffffff');
      const color2: Color = Color.of('#000000');
      const color3: Color = Color.of('#ffffff');
      const color4: Color = Color.of('#ffff00');
      const colors: Colors = Colors.ofArray([
        color1,
        color2
      ]);

      expect(colors.contains(color1)).toEqual(true);
      expect(colors.contains(color2)).toEqual(true);
      expect(colors.contains(color3)).toEqual(true);
      expect(colors.contains(color4)).toEqual(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const colors1: Colors = Colors.ofArray([
      ]);
      const colors2: Colors = Colors.ofArray([
        Color.of('#ffffff'),
        Color.of('#000000')
      ]);

      expect(colors1.isEmpty()).toEqual(true);
      expect(colors2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const color1: Color = Color.of('#ffffff');
      const color2: Color = Color.of('#000000');
      const colors1: Colors = Colors.ofArray([
        color1,
        color2
      ]);
      const colors2: Colors = Colors.ofArray([
        color1
      ]);

      expect(colors1.equals(colors1)).toEqual(true);
      expect(colors1.equals(colors2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const color1: Color = Color.of('#ffffff');
      const color2: Color = Color.of('#000000');
      const colors1: Colors = Colors.ofArray([
        color1,
        color2
      ]);
      const colors2: Colors = Colors.ofArray([
        color2,
        color1
      ]);

      expect(colors1.equals(colors1)).toEqual(true);
      expect(colors1.equals(colors2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const color1: Color = Color.of('#ffffff');
      const color2: Color = Color.of('#000000');
      const colors1: Colors = Colors.ofArray([
        color1,
        color2
      ]);
      const colors2: Colors = Colors.ofArray([
        color1,
        color2
      ]);

      expect(colors1.equals(colors1)).toEqual(true);
      expect(colors1.equals(colors2)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const rgb1: string = '#ffffff';
      const rgb2: string = '#000000';
      const colors: Colors = Colors.ofArray([
        Color.of(rgb1),
        Color.of(rgb2)
      ]);

      expect(colors.toString()).toEqual(`${rgb1}, ${rgb2}`);
    });
  });

  describe('chartScheme', () => {
    it('generates 20 colors', () => {
      const colors: Colors = Colors.chartScheme();
      expect(colors.size()).toEqual(20);
    });
  });
});

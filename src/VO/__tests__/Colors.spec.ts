import { ImmutableSequence } from 'publikum';
import { Color } from '../Color';
import { Colors } from '../Colors';
import { MockColor } from '../Mock/MockColor';

describe('Colors', () => {
  describe('of', () => {
    it('normal case', () => {
      const color1: MockColor = new MockColor();
      const color2: MockColor = new MockColor();
      const color3: MockColor = new MockColor();
      const sequence: ImmutableSequence<Color> = ImmutableSequence.of<Color>([
        color1,
        color2,
        color3
      ]);

      const colors: Colors = Colors.of(sequence);

      expect(colors.size()).toBe(sequence.size());
      for (let i: number = 0; i < colors.size(); i++) {
        expect(colors.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const colors: Array<MockColor> = [
        new MockColor(),
        new MockColor(),
        new MockColor()
      ];

      const colours: Colors = Colors.ofArray(colors);

      expect(colours.size()).toBe(colors.length);
      for (let i: number = 0; i < colours.size(); i++) {
        expect(colours.get(i).get()).toBe(colors[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      const color1: MockColor = new MockColor();
      const color2: MockColor = new MockColor();
      const color3: MockColor = new MockColor();

      const colours: Colors = Colors.ofSpread(
        color1,
        color2,
        color3
      );

      expect(colours.size()).toBe(3);
      expect(colours.get(0).get()).toBe(color1);
      expect(colours.get(1).get()).toBe(color2);
      expect(colours.get(2).get()).toBe(color3);
    });
  });

  describe('chartScheme', () => {
    it('generates 20 colors', () => {
      const colors: Colors = Colors.chartScheme();
      expect(colors.size()).toBe(20);
    });
  });

  describe('get', () => {
    it('when index is over the length of Colors, loops and returns the element of first', () => {
      const colors: Colors = Colors.ofArray([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      expect(colors.get(0).get().toString()).toBe('#ffffff');
      expect(colors.get(1).get().toString()).toBe('#000000');
      expect(colors.get(2).get().toString()).toBe('#ffffff');
      expect(colors.get(3).get().toString()).toBe('#000000');
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Colors', () => {
      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const color3: MockColor = new MockColor('#ffffff');
      const color4: MockColor = new MockColor('#ffff00');
      const colors: Colors = Colors.ofSpread(
        color1,
        color2
      );

      expect(colors.contains(color1)).toBe(true);
      expect(colors.contains(color2)).toBe(true);
      expect(colors.contains(color3)).toBe(true);
      expect(colors.contains(color4)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const colors1: Colors = Colors.ofArray([]);
      const colors2: Colors = Colors.ofArray([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      expect(colors1.isEmpty()).toBe(true);
      expect(colors2.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const colors1: Colors = Colors.ofArray([
        color1,
        color2
      ]);
      const colors2: Colors = Colors.ofArray([
        color1
      ]);

      expect(colors1.equals(colors1)).toBe(true);
      expect(colors1.equals(colors2)).toBe(false);
    });

    it('returns false if the sequence is different', () => {
      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const colors1: Colors = Colors.ofArray([
        color1,
        color2
      ]);
      const colors2: Colors = Colors.ofArray([
        color2,
        color1
      ]);

      expect(colors1.equals(colors1)).toBe(true);
      expect(colors1.equals(colors2)).toBe(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const colors1: Colors = Colors.ofArray([
        color1,
        color2
      ]);
      const colors2: Colors = Colors.ofArray([
        color1,
        color2
      ]);

      expect(colors1.equals(colors1)).toBe(true);
      expect(colors1.equals(colors2)).toBe(true);
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

      expect(colors.toString()).toBe(`${rgb1}, ${rgb2}`);
    });
  });
});

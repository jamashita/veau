import { ImmutableSequence, MockSequence } from '@jamashita/lluvia-sequence';
import { Color } from '../Color';
import { Colors } from '../Colors';
import { MockColor } from '../mock/MockColor';

describe('Colors', () => {
  describe('of', () => {
    it('normal case', () => {
      const color1: MockColor = new MockColor();
      const color2: MockColor = new MockColor();
      const color3: MockColor = new MockColor();
      const sequence: ImmutableSequence<Color> = ImmutableSequence.ofArray([color1, color2, color3]);

      const colors: Colors = Colors.of(sequence);

      expect(colors.size()).toBe(sequence.size());
      for (let i: number = 0; i < colors.size(); i++) {
        expect(colors.get(i)).toBe(sequence.get(i));
      }
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const colors: Array<MockColor> = [new MockColor(), new MockColor(), new MockColor()];

      const colours: Colors = Colors.ofArray(colors);

      expect(colours.size()).toBe(colors.length);
      for (let i: number = 0; i < colours.size(); i++) {
        expect(colours.get(i)).toBe(colors[i]);
      }
    });
  });

  describe('chartScheme', () => {
    it('generates 20 colors', () => {
      const colors: Colors = Colors.chartScheme();

      expect(colors.size()).toBe(20);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'get');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.get(0);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'contains');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.contains(new MockColor(''));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'size');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.size();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'isEmpty');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.isEmpty();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const colors: Colors = Colors.ofArray([]);

      expect(colors.equals(null)).toBe(false);
      expect(colors.equals(undefined)).toBe(false);
      expect(colors.equals('')).toBe(false);
      expect(colors.equals('123')).toBe(false);
      expect(colors.equals('abcd')).toBe(false);
      expect(colors.equals(123)).toBe(false);
      expect(colors.equals(0)).toBe(false);
      expect(colors.equals(-12)).toBe(false);
      expect(colors.equals(0.3)).toBe(false);
      expect(colors.equals(false)).toBe(false);
      expect(colors.equals(true)).toBe(false);
      expect(colors.equals(Symbol('p'))).toBe(false);
      expect(colors.equals(20n)).toBe(false);
      expect(colors.equals({})).toBe(false);
      expect(colors.equals([])).toBe(false);
      expect(colors.equals(Object.create(null))).toBe(false);
    });

    it('same instance', () => {
      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const colors: Colors = Colors.ofArray([color1, color2]);

      expect(colors.equals(colors)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'equals');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.equals(Colors.ofArray([]));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const arr: Array<MockColor> = [color1, color2];

      const sequence: MockSequence<Color> = new MockSequence(arr);

      const colors: Colors = Colors.of(sequence);

      let i: number = 0;

      for (const [, v] of colors) {
        expect(v).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'forEach');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.forEach(() => {
        // NOOP
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'every');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.every(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'some');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.some(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'values');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.values();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const colors: Colors = Colors.of(sequence);

      const filtered: Colors = colors.filter((c: Color) => {
        return c.equals(sequence.get(1));
      });

      expect(filtered.size()).toBe(1);
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'find');
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors = sequence;
      colors.find(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('does not affect the length, only change the instance', () => {
      const sequence: MockSequence<Color> = new MockSequence([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const colors: Colors = Colors.of(sequence);

      const mapped: ImmutableSequence<string> = colors.map((c: Color): string => {
        return c.get();
      });

      expect(mapped.size()).toBe(2);
    });
  });
});

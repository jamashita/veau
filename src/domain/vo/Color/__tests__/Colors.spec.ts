import { ImmutableSequence, MockSequence } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { Color } from '../Color';
import { Colors } from '../Colors';
import { MockColor } from '../mock/MockColor';

describe('Colors', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(4);

      const color1: MockColor = new MockColor();
      const color2: MockColor = new MockColor();
      const color3: MockColor = new MockColor();
      const sequence: ImmutableSequence<Color> = ImmutableSequence.ofArray<Color>([color1, color2, color3]);

      const colors: Colors = Colors.of(sequence);

      expect(colors.size()).toBe(sequence.size());
      for (let i: number = 0; i < colors.size(); i++) {
        expect(colors.get(i)).toBe(sequence.get(i));
      }
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      expect.assertions(4);

      const colors: Array<MockColor> = [new MockColor(), new MockColor(), new MockColor()];

      const colours: Colors = Colors.ofArray(colors);

      expect(colours.size()).toBe(colors.length);
      for (let i: number = 0; i < colours.size(); i++) {
        expect(colours.get(i)).toBe(colors[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      expect.assertions(4);

      const color1: MockColor = new MockColor();
      const color2: MockColor = new MockColor();
      const color3: MockColor = new MockColor();

      const colours: Colors = Colors.ofSpread(color1, color2, color3);

      expect(colours.size()).toBe(3);
      expect(colours.get(0)).toBe(color1);
      expect(colours.get(1)).toBe(color2);
      expect(colours.get(2)).toBe(color3);
    });
  });

  describe('chartScheme', () => {
    it('generates 20 colors', () => {
      expect.assertions(1);

      const colors: Colors = Colors.chartScheme();

      expect(colors.size()).toBe(20);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.get = spy;
      colors.get(0);

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.contains = spy;
      colors.contains(new MockColor(''));

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.size = spy;
      colors.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.isEmpty = spy;
      colors.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const colors: Colors = Colors.ofSpread();

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
      expect.assertions(1);

      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const colors: Colors = Colors.ofArray([color1, color2]);

      expect(colors.equals(colors)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.equals = spy;
      colors.equals(Colors.ofArray([]));

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.toString = spy;
      colors.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(2);

      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const arr: Array<MockColor> = [color1, color2];

      const sequence: MockSequence<Color> = new MockSequence<Color>(arr);

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
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.forEach = spy;
      colors.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.every = spy;
      colors.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.some = spy;
      colors.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.values = spy;
      colors.values();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
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
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const spy: SinonSpy = sinon.spy();
      const colors: Colors = Colors.of(sequence);

      // @ts-expect-error
      colors.colors.find = spy;
      colors.find(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('does not affect the length, only change the instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<Color> = new MockSequence<Color>([
        new MockColor('#ffffff'),
        new MockColor('#000000')
      ]);

      const colors: Colors = Colors.of(sequence);

      const mapped: ImmutableSequence<string> = colors.map<string>((c: Color) => {
        return c.get();
      });

      expect(mapped.size()).toBe(2);
    });
  });
});

import { ImmutableSequence, MockASequence } from '@jamashita/publikum-collection';

import { Color } from '../Color';
import { Colors } from '../Colors';
import { MockColor } from '../Mock/MockColor';
import sinon, { SinonSpy } from 'sinon';

describe('Colors', () => {
  describe('of', () => {
    it('normal case', () => {
      const color1: MockColor = new MockColor();
      const color2: MockColor = new MockColor();
      const color3: MockColor = new MockColor();
      const sequence: ImmutableSequence<Color> = ImmutableSequence.of<Color>([color1, color2, color3]);

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

  describe('ofSpread', () => {
    it('normal case', () => {
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
      const colors: Colors = Colors.chartScheme();

      expect(colors.size()).toBe(20);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.get = spy;

      const colors: Colors = Colors.of(sequence);

      colors.get(0);

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.contains = spy;

      const colors: Colors = Colors.of(sequence);

      colors.contains(new MockColor(''));

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.size = spy;

      const colors: Colors = Colors.of(sequence);

      colors.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.isEmpty = spy;

      const colors: Colors = Colors.of(sequence);

      colors.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const colors: Colors = Colors.ofArray([color1, color2]);

      expect(colors.equals(colors)).toBe(true);
    });

    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.equals = spy;

      const colors: Colors = Colors.of(sequence);

      colors.equals(Colors.ofArray([]));

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.toString = spy;

      const colors: Colors = Colors.of(sequence);

      colors.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', async () => {
      const color1: MockColor = new MockColor('#ffffff');
      const color2: MockColor = new MockColor('#000000');
      const arr: Array<MockColor> = [color1, color2];

      const sequence: MockASequence<Color> = new MockASequence<Color>(
        arr
      );

      const colors: Colors = Colors.of(sequence);

      let i: number = 0;

      for (const color of colors) {
        expect(color.getValue()).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.forEach = spy;

      const colors: Colors = Colors.of(sequence);

      colors.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.every = spy;

      const colors: Colors = Colors.of(sequence);

      colors.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<Color> = new MockASequence<Color>(
        [new MockColor('#ffffff'), new MockColor('#000000')]
      );

      const spy: SinonSpy = sinon.spy();

      sequence.some = spy;

      const colors: Colors = Colors.of(sequence);

      colors.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});

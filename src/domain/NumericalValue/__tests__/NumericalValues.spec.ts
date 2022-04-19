import { ImmutableSequence, Sequence } from '@jamashita/lluvia-sequence';
import { NumericalValue } from '../NumericalValue';
import { NumericalValues } from '../NumericalValues';

describe('NumericalValues', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns empty', () => {
      const values: NumericalValues = NumericalValues.of(ImmutableSequence.empty());

      expect(values).toBe(NumericalValues.empty());
    });

    it('normal case', () => {
      const sequence: ImmutableSequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(2)
      ]);

      const values: NumericalValues = NumericalValues.of(sequence);

      expect(values.size()).toBe(sequence.size());
      for (let i: number = 0; i < values.size(); i++) {
        expect(values.get(i)).toBe(sequence.get(i));
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns NumericalValues.empty()', () => {
      const values: NumericalValues = NumericalValues.ofArray([]);

      expect(values).toBe(NumericalValues.empty());
    });

    it('normal case', () => {
      const values: Array<NumericalValue> = [
        NumericalValue.of(1),
        NumericalValue.of(3),
        NumericalValue.of(2)
      ];

      const numericalValues: NumericalValues = NumericalValues.ofArray(values);

      expect(numericalValues.size()).toBe(values.length);
      for (let i: number = 0; i < numericalValues.size(); i++) {
        expect(numericalValues.get(i)).toBe(values[i]);
      }
    });
  });

  describe('empty', () => {
    it('returns size-0 sequence', () => {
      expect(NumericalValues.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(NumericalValues.empty()).toBe(NumericalValues.empty());
    });
  });

  describe('add', () => {
    it('does not affect the original one', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(1);
      const value3: NumericalValue = NumericalValue.of(1);

      const values1: NumericalValues = NumericalValues.ofArray([value1, value2]);
      const values2: NumericalValues = values1.add(value3);

      expect(values1.size()).toBe(2);
      expect(values1.get(0)).toBe(value1);
      expect(values1.get(1)).toBe(value2);

      expect(values2.size()).toBe(3);
      expect(values2.get(0)).toBe(value1);
      expect(values2.get(1)).toBe(value2);
      expect(values2.get(2)).toBe(value3);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'get');

      // @ts-expect-error
      values.vals = sequence;

      values.get(0);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'contains');

      // @ts-expect-error
      values.vals = sequence;

      values.contains(NumericalValue.of(1));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'size');
      // @ts-expect-error
      values.vals = sequence;

      values.size();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'forEach');
      // @ts-expect-error
      values.vals = sequence;

      values.forEach(() => {
        // NOOP
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'isEmpty');
      // @ts-expect-error
      values.vals = sequence;

      values.isEmpty();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const values: NumericalValues = NumericalValues.empty();

      expect(values.equals(null)).toBe(false);
      expect(values.equals(undefined)).toBe(false);
      expect(values.equals('')).toBe(false);
      expect(values.equals('123')).toBe(false);
      expect(values.equals('abcd')).toBe(false);
      expect(values.equals(123)).toBe(false);
      expect(values.equals(0)).toBe(false);
      expect(values.equals(-12)).toBe(false);
      expect(values.equals(0.3)).toBe(false);
      expect(values.equals(false)).toBe(false);
      expect(values.equals(true)).toBe(false);
      expect(values.equals(Symbol('p'))).toBe(false);
      expect(values.equals(20n)).toBe(false);
      expect(values.equals({})).toBe(false);
      expect(values.equals([])).toBe(false);
      expect(values.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the same instance given', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);

      const values: NumericalValues = NumericalValues.ofArray([value1, value2]);

      expect(values.equals(values)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'equals');
      // @ts-expect-error
      values.vals = sequence;

      values.equals(NumericalValues.ofArray([value2, value1]));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('row', () => {
    it('returns as a string Array', () => {
      const num1: number = 1;
      const num2: number = 2;
      const nums: Array<number> = [num1, num2];

      const values: NumericalValues = NumericalValues.ofArray([
        NumericalValue.of(num1),
        NumericalValue.of(num2)
      ]);

      const rows: Array<string> = values.row();

      expect(rows).toHaveLength(nums.length);
      for (let i: number = 0; i < nums.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(rows[i]).toBe(nums[i]!.toString());
      }
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(1);
      const value3: NumericalValue = NumericalValue.of(1);
      const arr: Array<NumericalValue> = [value1, value2, value3];

      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray(arr);
      const values: NumericalValues = NumericalValues.empty();
      // @ts-expect-error
      values.vals = sequence;

      let i: number = 0;

      for (const [, v] of values) {
        expect(v).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'every');
      // @ts-expect-error
      values.vals = sequence;

      values.every(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'some');
      // @ts-expect-error
      values.vals = sequence;

      values.some(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'values');
      // @ts-expect-error
      values.vals = sequence;

      values.values();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.empty();
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'find');
      // @ts-expect-error
      values.vals = sequence;

      values.find(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('returns matching elements by predicate', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(3)
      ]);
      const values: NumericalValues = NumericalValues.of(sequence);
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'filter');
      // @ts-expect-error
      values.vals = sequence;

      values.filter(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('delegates its inner collection instance', () => {
      const sequence: Sequence<NumericalValue> = ImmutableSequence.ofArray([
        NumericalValue.of(1),
        NumericalValue.of(1),
        NumericalValue.of(1)
      ]);
      const values: NumericalValues = NumericalValues.of(sequence);
      const spy: jest.SpyInstance = jest.spyOn(sequence, 'map');
      // @ts-expect-error
      values.vals = sequence;

      values.map((v: NumericalValue): NumericalValue => {
        return v;
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});

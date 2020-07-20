import { ImmutableSequence, MockASequence } from '@jamashita/publikum-collection';
import sinon, { SinonSpy } from 'sinon';

import { MockNumericalValue } from '../Mock/MockNumericalValue';
import { NumericalValue } from '../NumericalValue';
import { NumericalValues } from '../NumericalValues';

describe('NumericalValues', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns empty', () => {
      const values: NumericalValues = NumericalValues.of(ImmutableSequence.empty<NumericalValue>());

      expect(values).toBe(NumericalValues.empty());
    });

    it('normal case', () => {
      const sequence: ImmutableSequence<MockNumericalValue> = ImmutableSequence.of<MockNumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue()
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
      const values: Array<MockNumericalValue> = [
        new MockNumericalValue(1),
        new MockNumericalValue(2),
        new MockNumericalValue(3)
      ];

      const numericalValues: NumericalValues = NumericalValues.ofArray(values);

      expect(numericalValues.size()).toBe(values.length);
      for (let i: number = 0; i < numericalValues.size(); i++) {
        expect(numericalValues.get(i)).toBe(values[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns NumericalValues.empty()', () => {
      const values: NumericalValues = NumericalValues.ofSpread();

      expect(values).toBe(NumericalValues.empty());
    });

    it('normal case', () => {
      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(2);
      const value3: MockNumericalValue = new MockNumericalValue(3);

      const numericalValues: NumericalValues = NumericalValues.ofSpread(value1, value2, value3);

      expect(numericalValues.size()).toBe(3);
      expect(numericalValues.get(0)).toBe(value1);
      expect(numericalValues.get(1)).toBe(value2);
      expect(numericalValues.get(2)).toBe(value3);
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
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const value3: MockNumericalValue = new MockNumericalValue();

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

    it('inserts by spread syntax', () => {
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const value3: MockNumericalValue = new MockNumericalValue();

      const values1: NumericalValues = NumericalValues.empty();
      const values2: NumericalValues = values1.add(value1, value2, value3);

      expect(values1.size()).toBe(0);
      expect(values2.size()).toBe(3);
      expect(values2.get(0)).toBe(value1);
      expect(values2.get(1)).toBe(value2);
      expect(values2.get(2)).toBe(value3);
    });

    it('returns itself when the argument is 0', () => {
      const values1: NumericalValues = NumericalValues.empty();
      const values2: NumericalValues = values1.add();

      expect(values1).toBe(values2);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.get = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.get(0);

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.contains = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.contains(new MockNumericalValue(1));

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.size = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.forEach = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.isEmpty = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(2);

      const values: NumericalValues = NumericalValues.ofArray([value1, value2]);

      expect(values.equals(values)).toBe(true);
    });

    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(2);

      const spy: SinonSpy = sinon.spy();

      sequence.equals = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.equals(NumericalValues.ofArray([value2, value1]));

      expect(spy.called).toBe(true);
    });
  });

  describe('row', () => {
    it('returns as a string Array', () => {
      const num1: number = 1;
      const num2: number = 2;
      const nums: Array<number> = [num1, num2];

      const values: NumericalValues = NumericalValues.ofArray([
        new MockNumericalValue(num1),
        new MockNumericalValue(num2)
      ]);

      const rows: Array<string> = values.row();

      expect(rows.length).toBe(nums.length);
      for (let i: number = 0; i < nums.length; i++) {
        expect(rows[i]).toBe(nums[i].toString());
      }
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.toString = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', async () => {
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const value3: MockNumericalValue = new MockNumericalValue();
      const arr: Array<MockNumericalValue> = [value1, value2, value3];

      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>(arr);

      const values: NumericalValues = NumericalValues.of(sequence);

      let i: number = 0;
      for (const pair of values) {
        expect(pair.getValue()).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.every = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<NumericalValue> = new MockASequence<NumericalValue>([
        new MockNumericalValue(),
        new MockNumericalValue(),
        new MockNumericalValue()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.some = spy;

      const values: NumericalValues = NumericalValues.of(sequence);

      values.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});

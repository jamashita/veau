import { ImmutableSequence } from '../../General/Collection/Sequence/ImmutableSequence';
import { Absent } from '../../General/Quantum/Absent';
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
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const sequence: ImmutableSequence<MockNumericalValue> = ImmutableSequence.of<MockNumericalValue>([
        value1,
        value2
      ]);

      const values: NumericalValues = NumericalValues.of(sequence);

      expect(values.size()).toEqual(sequence.size());
      for (let i: number = 0; i < values.size(); i++) {
        expect(values.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns NumericalValues.empty()', () => {
      const values: NumericalValues = NumericalValues.ofArray([]);

      expect(values).toBe(NumericalValues.empty());
    });

    it('normal case', () => {
      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(2);
      const value3: MockNumericalValue = new MockNumericalValue(3);
      const values: Array<MockNumericalValue> = [
        value1,
        value2,
        value3
      ];

      const numericalValues: NumericalValues = NumericalValues.ofArray(values);

      expect(numericalValues.size()).toEqual(values.length);
      for (let i: number = 0; i < numericalValues.size(); i++) {
        expect(numericalValues.get(i).get()).toBe(values[i]);
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
      const values: Array<MockNumericalValue> = [
        value1,
        value2,
        value3
      ];

      const numericalValues: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2,
        value3
      );

      expect(numericalValues.size()).toEqual(values.length);
      for (let i: number = 0; i < numericalValues.size(); i++) {
        expect(numericalValues.get(i).get()).toBe(values[i]);
      }
    });
  });

  describe('empty', () => {
    it('returns size-0 sequence', () => {
      expect(NumericalValues.empty().size()).toEqual(0);
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

      const values1: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );
      const values2: NumericalValues = values1.add(value3);

      expect(values1.size()).toEqual(2);
      expect(values1.get(0).get()).toBe(value1);
      expect(values1.get(1).get()).toBe(value2);

      expect(values2.size()).toEqual(3);
      expect(values2.get(0).get()).toBe(value1);
      expect(values2.get(1).get()).toBe(value2);
      expect(values2.get(2).get()).toBe(value3);
    });

    it('inserts by spread syntax', () => {
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const value3: MockNumericalValue = new MockNumericalValue();

      const values1: NumericalValues = NumericalValues.empty();
      const values2: NumericalValues = values1.add(
        value1,
        value2,
        value3
      );

      expect(values1.size()).toEqual(0);
      expect(values2.size()).toEqual(3);
      expect(values2.get(0).get()).toBe(value1);
      expect(values2.get(1).get()).toBe(value2);
      expect(values2.get(2).get()).toBe(value3);
    });

    it('returns itself when the argument is 0', () => {
      const values1: NumericalValues = NumericalValues.empty();
      const values2: NumericalValues = values1.add();

      expect(values1).toBe(values2);
    });
  });

  describe('get', () => {
    it('returns NumericalValue instance at the correct index', () => {
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const value3: MockNumericalValue = new MockNumericalValue();

      const values: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2,
        value3
      );

      expect(values.size()).toEqual(3);
      expect(values.get(0).get()).toBe(value1);
      expect(values.get(1).get()).toBe(value2);
      expect(values.get(2).get()).toBe(value3);
    });

    it('returns Absent when the index is out of range', () => {
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const value3: MockNumericalValue = new MockNumericalValue();

      const values: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2,
        value3
      );

      expect(values.get(-1)).toBeInstanceOf(Absent);
      expect(values.get(3)).toBeInstanceOf(Absent);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the NumericalValues', () => {
      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(2);
      const value3: MockNumericalValue = new MockNumericalValue(3);
      const value4: MockNumericalValue = new MockNumericalValue(1);

      const values: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );

      expect(values.contains(value1)).toEqual(true);
      expect(values.contains(value2)).toEqual(true);
      expect(values.contains(value3)).toEqual(false);
      expect(values.contains(value4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements a re 0', () => {
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();

      const values1: NumericalValues = NumericalValues.empty();
      const values2: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );

      expect(values1.isEmpty()).toEqual(true);
      expect(values2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(2);

      const values1: NumericalValues = NumericalValues.ofSpread(
        value1
      );
      const values2: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );

      expect(values1.equals(values1)).toEqual(true);
      expect(values1.equals(values2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(2);

      const values1: NumericalValues = NumericalValues.ofSpread(
        value2,
        value1
      );
      const values2: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );

      expect(values1.equals(values1)).toEqual(true);
      expect(values1.equals(values2)).toEqual(false);
    });

    it('returns true if the length and the sequence are the same', () => {
      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(2);

      const values1: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );
      const values2: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );

      expect(values1.equals(values1)).toEqual(true);
      expect(values1.equals(values2)).toEqual(true);
    });
  });

  describe('row', () => {
    it('returns as a string Array', () => {
      const num1: number = 1;
      const num2: number = 2;
      const nums: Array<number> = [
        num1,
        num2
      ];
      const value1: MockNumericalValue = new MockNumericalValue(num1);
      const value2: MockNumericalValue = new MockNumericalValue(num2);

      const values: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );

      const rows: Array<string> = values.row();
      expect(rows.length).toEqual(nums.length);
      for (let i: number = 0; i < nums.length; i++) {
        expect(rows[i]).toEqual(nums[i].toString());
      }
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const num1: number = 1;
      const num2: number = 2;
      const value1: MockNumericalValue = new MockNumericalValue(num1);
      const value2: MockNumericalValue = new MockNumericalValue(num2);

      const values: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );

      expect(values.toString()).toEqual(`${num1}, ${num2}`);
    });
  });
});

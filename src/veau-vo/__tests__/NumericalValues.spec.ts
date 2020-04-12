import { None } from '../../veau-general/Optional/None';
import { NumericalValues } from '../NumericalValues';
import { MockNumericalValue } from '../Mock/MockNumericalValue';
import { Sequence } from '../../veau-general/Collection/Sequence';
import { NumericalValue } from '../NumericalValue';

describe('NumericalValues', () => {
  describe('of', () => {
    it('when the Sequence is zero size, returns empty', () => {
      const values: NumericalValues = NumericalValues.of(Sequence.empty<NumericalValue>());

      expect(values).toBe(NumericalValues.empty());
    });

    it('normal case', () => {
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const sequence: Sequence<MockNumericalValue> = Sequence.of<MockNumericalValue>([
        value1,
        value2
      ]);

      const values: NumericalValues = NumericalValues.of(sequence);

      expect(values.size()).toEqual(sequence.size());
      for (let i: number = 0; i < values.size(); i++) {
        expect(values.get(i).get()).toEqual(sequence.get(i).get());
      }
    });
  });

  describe('ofArray', () => {
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
        expect(numericalValues.get(i).get()).toEqual(values[i]);
      }
    });
  });

  describe('ofSpread', () => {
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
        expect(numericalValues.get(i).get()).toEqual(values[i]);
      }
    });
  });

  describe('empty', () => {
    it('returns size-0 sequence', () => {
      expect(NumericalValues.empty().size()).toEqual(0);
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
      expect(values1.get(0).get()).toEqual(value1);
      expect(values1.get(1).get()).toEqual(value2);

      expect(values2.size()).toEqual(3);
      expect(values2.get(0).get()).toEqual(value1);
      expect(values2.get(1).get()).toEqual(value2);
      expect(values2.get(2).get()).toEqual(value3);
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
      expect(values2.get(0).get()).toEqual(value1);
      expect(values2.get(1).get()).toEqual(value2);
      expect(values2.get(2).get()).toEqual(value3);
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
      expect(values.get(0).get()).toEqual(value1);
      expect(values.get(1).get()).toEqual(value2);
      expect(values.get(2).get()).toEqual(value3);
    });

    it('returns None when the index is out of range', () => {
      const value1: MockNumericalValue = new MockNumericalValue();
      const value2: MockNumericalValue = new MockNumericalValue();
      const value3: MockNumericalValue = new MockNumericalValue();

      const values: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2,
        value3
      );

      expect(values.get(-1)).toBeInstanceOf(None);
      expect(values.get(3)).toBeInstanceOf(None);
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
      const value1: MockNumericalValue = new MockNumericalValue(num1);
      const value2: MockNumericalValue = new MockNumericalValue(num2);

      const values: NumericalValues = NumericalValues.ofSpread(
        value1,
        value2
      );

      expect(values.row()).toEqual([num1.toString(), num2.toString()]);
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

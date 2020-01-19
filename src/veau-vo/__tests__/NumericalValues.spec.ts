import 'jest';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { NumericalValue } from '../NumericalValue';
import { NumericalValues } from '../NumericalValues';

describe('NumericalValues', () => {
  describe('add', () => {
    it('does not affect the original one', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);
      const value3: NumericalValue = NumericalValue.of(3);

      const values1: NumericalValues = NumericalValues.of([value1, value2]);
      const values2: NumericalValues = values1.add(value3);

      expect(values1.size()).toEqual(2);
      expect(values1.get(0)).toEqual(value1);
      expect(values1.get(1)).toEqual(value2);

      expect(values2.size()).toEqual(3);
      expect(values2.get(0)).toEqual(value1);
      expect(values2.get(1)).toEqual(value2);
      expect(values2.get(2)).toEqual(value3);
    });
  });

  describe('get', () => {
    it('returns NumericalValue instance at the correct index', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);
      const value3: NumericalValue = NumericalValue.of(3);

      const values: NumericalValues = NumericalValues.of([value1, value2, value3]);

      expect(values.size()).toEqual(3);
      expect(values.get(0)).toEqual(value1);
      expect(values.get(1)).toEqual(value2);
      expect(values.get(2)).toEqual(value3);
    });

    it('throws NoSuchElementError when the index is out of range', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);
      const value3: NumericalValue = NumericalValue.of(3);

      const values: NumericalValues = NumericalValues.of([value1, value2, value3]);

      expect(() => {
        values.get(-1);
      }).toThrow(NoSuchElementError);
      expect(() => {
        values.get(3);
      }).toThrow(NoSuchElementError);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the NumericalValues', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);
      const value3: NumericalValue = NumericalValue.of(3);
      const value4: NumericalValue = NumericalValue.of(1);

      const values: NumericalValues = NumericalValues.of([value1, value2]);

      expect(values.contains(value1)).toEqual(true);
      expect(values.contains(value2)).toEqual(true);
      expect(values.contains(value3)).toEqual(false);
      expect(values.contains(value4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements a re 0', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);

      const values1: NumericalValues = NumericalValues.of([]);
      const values2: NumericalValues = NumericalValues.of([value1, value2]);

      expect(values1.isEmpty()).toEqual(true);
      expect(values2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);

      const values1: NumericalValues = NumericalValues.of([value1]);
      const values2: NumericalValues = NumericalValues.of([value1, value2]);

      expect(values1.equals(values1)).toEqual(true);
      expect(values1.equals(values2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);

      const values1: NumericalValues = NumericalValues.of([value2, value1]);
      const values2: NumericalValues = NumericalValues.of([value1, value2]);

      expect(values1.equals(values1)).toEqual(true);
      expect(values1.equals(values2)).toEqual(false);
    });

    it('returns true if the length and the sequence are the same', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(2);

      const values1: NumericalValues = NumericalValues.of([value1, value2]);
      const values2: NumericalValues = NumericalValues.of([value1, value2]);

      expect(values1.equals(values1)).toEqual(true);
      expect(values1.equals(values2)).toEqual(true);
    });
  });

  describe('row', () => {
    it('returns as a string Array', () => {
      const num1: number = 1;
      const num2: number = 2;
      const value1: NumericalValue = NumericalValue.of(num1);
      const value2: NumericalValue = NumericalValue.of(num2);

      const values: NumericalValues = NumericalValues.of([value1, value2]);

      expect(values.row()).toEqual([num1.toString(), num2.toString()]);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const num1: number = 1;
      const num2: number = 2;
      const value1: NumericalValue = NumericalValue.of(num1);
      const value2: NumericalValue = NumericalValue.of(num2);

      const values: NumericalValues = NumericalValues.of([value1, value2]);

      expect(values.toString()).toEqual(`${num1}, ${num2}`);
    });
  });
});

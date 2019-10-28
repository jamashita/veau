import 'jest';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { AsOf } from '../AsOf';
import { AsOfs } from '../AsOfs';

describe('AsOfs', () => {
  describe('get', () => {
    it('returns AsOf instance at the correct index', ()  => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');
      const asOf3: AsOf = AsOf.ofString('2000-01-03');

      const asOfs: AsOfs = AsOfs.of([asOf1, asOf2, asOf3]);

      expect(asOfs.size()).toEqual(3);
      expect(asOfs.get(0)).toEqual(asOf1);
      expect(asOfs.get(1)).toEqual(asOf2);
      expect(asOfs.get(2)).toEqual(asOf3);
    });

    it('throws NoSuchElementError when the index is out of range', () => {
      const asOfs: AsOfs = AsOfs.of([]);

      expect(() => {
        asOfs.get(-1);
      }).toThrow(NoSuchElementError);
      expect(() => {
        asOfs.get(0);
      }).toThrow(NoSuchElementError);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the AsOfs', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');
      const asOf3: AsOf = AsOf.ofString('2000-01-03');
      const asOf4: AsOf = AsOf.ofString('2000-01-02');

      const asOfs: AsOfs = AsOfs.of([asOf1, asOf2]);

      expect(asOfs.contains(asOf1)).toEqual(true);
      expect(asOfs.contains(asOf2)).toEqual(true);
      expect(asOfs.contains(asOf3)).toEqual(false);
      expect(asOfs.contains(asOf4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');

      const asOfs1: AsOfs = AsOfs.of([]);
      const asOfs2: AsOfs = AsOfs.of([asOf1, asOf2]);

      expect(asOfs1.isEmpty()).toEqual(true);
      expect(asOfs2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');

      const asOfs1: AsOfs = AsOfs.of([asOf1]);
      const asOfs2: AsOfs = AsOfs.of([asOf1, asOf2]);

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');

      const asOfs1: AsOfs = AsOfs.of([asOf2, asOf1]);
      const asOfs2: AsOfs = AsOfs.of([asOf1, asOf2]);

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');

      const asOfs1: AsOfs = AsOfs.of([asOf1, asOf2]);
      const asOfs2: AsOfs = AsOfs.of([asOf1, asOf2]);

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(true);
    });
  });
});

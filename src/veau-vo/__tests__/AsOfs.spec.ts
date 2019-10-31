import 'jest';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { RuntimeError } from '../../veau-general/RuntimeError';
import { AsOf } from '../AsOf';
import { AsOfs } from '../AsOfs';

describe('AsOfs', () => {
  describe('add', () => {
    it('does not affect the original one', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');
      const asOf3: AsOf = AsOf.ofString('2000-01-03');

      const asOfs1: AsOfs = AsOfs.of([asOf1, asOf2]);
      const asOfs2: AsOfs = asOfs1.add(asOf3);

      expect(asOfs1.size()).toEqual(2);
      expect(asOfs1.get(0)).toEqual(asOf1);
      expect(asOfs1.get(1)).toEqual(asOf2);

      expect(asOfs2.size()).toEqual(3);
      expect(asOfs2.get(0)).toEqual(asOf1);
      expect(asOfs2.get(1)).toEqual(asOf2);
      expect(asOfs2.get(2)).toEqual(asOf3);
    });
  });

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

  describe('min', () => {
    it('returns minimal asOf', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-03');
      const asOf2: AsOf = AsOf.ofString('2000-01-01');
      const asOf3: AsOf = AsOf.ofString('2000-01-02');
      const asOf4: AsOf = AsOf.ofString('2000-01-01');

      const asOfs: AsOfs = AsOfs.of([asOf1, asOf2, asOf3, asOf4]);

      expect(asOfs.min().getString()).toEqual('2000-01-01');
    });

    it('throws RuntimeError when AsOfs are empty', () =>{
      expect(() => {
        AsOfs.empty().min();
      }).toThrow(RuntimeError);
    });
  });

  describe('max', () => {
    it('returns minimal asOf', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-03');
      const asOf2: AsOf = AsOf.ofString('2000-01-01');
      const asOf3: AsOf = AsOf.ofString('2000-01-02');
      const asOf4: AsOf = AsOf.ofString('2000-01-03');

      const asOfs: AsOfs = AsOfs.of([asOf1, asOf2, asOf3, asOf4]);

      expect(asOfs.max().getString()).toEqual('2000-01-03');
    });

    it('throws RuntimeError when AsOfs are empty', () =>{
      expect(() => {
        AsOfs.empty().max();
      }).toThrow(RuntimeError);
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

  describe('toJSON', () => {
    it('normal case', () => {
      const asOfs: AsOfs = AsOfs.of([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      expect(asOfs.toJSON()).toEqual([
        '2000-01-01',
        '2000-01-02',
        '2000-01-03'
      ]);
    });
  });

  describe('empty', () => {
    it('always empty, the length is 0', () => {
      const asOfs: AsOfs = AsOfs.empty();

      expect(asOfs.isEmpty()).toEqual(true);
    });
  });
});
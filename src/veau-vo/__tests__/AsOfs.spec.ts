import { None } from '../../veau-general/Optional/None';
import { AsOf } from '../AsOf';
import { AsOfs } from '../AsOfs';

describe('AsOfs', () => {
  describe('[Symbol.iterator]', () => {
    it('can iterate for loop', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-03').get();
      const asOfs: AsOfs = AsOfs.of([
        asOf1,
        asOf2,
        asOf3
      ]);

      let i: number = 0;
      for (const asOf of asOfs) {
        expect(asOfs.get(i).get()).toBe(asOf);
        i++;
      }

      expect(i).toEqual(asOfs.size());
    });
  });

  describe('get', () => {
    it('returns AsOf instance at the correct index', ()  => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-03').get();
      const asOfs: AsOfs = AsOfs.of([
        asOf1,
        asOf2,
        asOf3
      ]);

      expect(asOfs.size()).toEqual(3);
      expect(asOfs.get(0).get()).toEqual(asOf1);
      expect(asOfs.get(1).get()).toEqual(asOf2);
      expect(asOfs.get(2).get()).toEqual(asOf3);
    });

    it('returns None when the index is out of range', () => {
      const asOfs: AsOfs = AsOfs.empty();

      expect(asOfs.get(-1)).toBeInstanceOf(None);
      expect(asOfs.get(0)).toBeInstanceOf(None);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the AsOfs', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-03').get();
      const asOf4: AsOf = AsOf.ofString('2000-01-02').get();
      const asOfs: AsOfs = AsOfs.of([
        asOf1,
        asOf2
      ]);

      expect(asOfs.contains(asOf1)).toEqual(true);
      expect(asOfs.contains(asOf2)).toEqual(true);
      expect(asOfs.contains(asOf3)).toEqual(false);
      expect(asOfs.contains(asOf4)).toEqual(true);
    });
  });

  describe('min', () => {
    it('returns minimal asOf', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-03').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf4: AsOf = AsOf.ofString('2000-01-01').get();
      const asOfs: AsOfs = AsOfs.of([
        asOf1,
        asOf2,
        asOf3,
        asOf4
      ]);

      expect(asOfs.min().get().equals(asOf2)).toEqual(true);
    });

    it('returns asOf itself when the elements are only one', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-03').get();
      const asOfs: AsOfs = AsOfs.of([
        asOf
      ]);

      expect(asOfs.min().get().equals(asOf)).toEqual(true);
    });

    it('returns None when AsOfs are empty', () =>{
      expect(AsOfs.empty().min()).toBeInstanceOf(None);
    });
  });

  describe('max', () => {
    it('returns minimal asOf', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-03').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf4: AsOf = AsOf.ofString('2000-01-03').get();
      const asOfs: AsOfs = AsOfs.of([
        asOf1,
        asOf2,
        asOf3,
        asOf4
      ]);

      expect(asOfs.max().get().equals(asOf4)).toEqual(true);
    });

    it('returns asOf itself when the elements are only one', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-03').get();

      const asOfs: AsOfs = AsOfs.of([asOf]);

      expect(asOfs.max().get().equals(asOf)).toEqual(true);
    });

    it('returns None when AsOfs are empty', () =>{
      expect(AsOfs.empty().max()).toBeInstanceOf(None);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOfs1: AsOfs = AsOfs.empty();
      const asOfs2: AsOfs = AsOfs.of([
        asOf1,
        asOf2
      ]);

      expect(asOfs1.isEmpty()).toEqual(true);
      expect(asOfs2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOfs1: AsOfs = AsOfs.of([
        asOf1
      ]);
      const asOfs2: AsOfs = AsOfs.of([
        asOf1,
        asOf2
      ]);

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOfs1: AsOfs = AsOfs.of([
        asOf2,
        asOf1
      ]);
      const asOfs2: AsOfs = AsOfs.of([
        asOf1,
        asOf2
      ]);

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOfs1: AsOfs = AsOfs.of([
        asOf1,
        asOf2
      ]);
      const asOfs2: AsOfs = AsOfs.of([
        asOf1,
        asOf2
      ]);

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const asOfs: AsOfs = AsOfs.of([
        AsOf.ofString('2000-01-01').get(),
        AsOf.ofString('2000-01-02').get(),
        AsOf.ofString('2000-01-03').get()
      ]);

      expect(asOfs.toJSON()).toEqual([
        '2000-01-01',
        '2000-01-02',
        '2000-01-03'
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const asOfs: AsOfs = AsOfs.of([
        AsOf.ofString('2000-01-01').get(),
        AsOf.ofString('2000-01-02').get(),
        AsOf.ofString('2000-01-03').get()
      ]);

      expect(asOfs.toString()).toEqual('2000-01-01, 2000-01-02, 2000-01-03');
    });
  });

  describe('empty', () => {
    it('always empty, the length is 0', () => {
      const asOfs: AsOfs = AsOfs.empty();

      expect(asOfs.isEmpty()).toEqual(true);
    });
  });
});

import { ImmutableSequence } from '../../General/Collection/Sequence/ImmutableSequence';
import { None } from '../../General/Quantum/None';
import { AsOf } from '../AsOf';
import { AsOfs } from '../AsOfs';
import { MockAsOf } from '../Mock/MockAsOf';
import { Term } from '../Term';

// DONE
describe('AsOfs', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns empty', () => {
      const asOfs: AsOfs = AsOfs.of(ImmutableSequence.empty<AsOf>());

      expect(asOfs).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      const asOf1: MockAsOf = new MockAsOf();
      const asOf2: MockAsOf = new MockAsOf();
      const asOf3: MockAsOf = new MockAsOf();
      const sequence: ImmutableSequence<AsOf> = ImmutableSequence.of<AsOf>([
        asOf1,
        asOf2,
        asOf3
      ]);

      const asOfs: AsOfs = AsOfs.of(sequence);

      expect(asOfs.size()).toEqual(sequence.size());
      for (let i: number = 0; i < asOfs.size(); i++) {
        expect(asOfs.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns AsOfs.empty()', () => {
      const asOfs: AsOfs = AsOfs.ofArray([]);

      expect(asOfs).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      const asOf1: MockAsOf = new MockAsOf();
      const asOf2: MockAsOf = new MockAsOf();
      const asOf3: MockAsOf = new MockAsOf();
      const as: Array<AsOf> = [
        asOf1,
        asOf2,
        asOf3
      ];

      const asOfs: AsOfs = AsOfs.ofArray(as);

      expect(asOfs.size()).toEqual(as.length);
      for (let i: number = 0; i < asOfs.size(); i++) {
        expect(asOfs.get(i).get()).toBe(as[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns AsOfs.empty()', () => {
      const asOfs: AsOfs = AsOfs.ofSpread();

      expect(asOfs).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      const asOf1: MockAsOf = new MockAsOf();
      const asOf2: MockAsOf = new MockAsOf();
      const asOf3: MockAsOf = new MockAsOf();
      const as: Array<AsOf> = [
        asOf1,
        asOf2,
        asOf3
      ];

      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2,
        asOf3
      );

      expect(asOfs.size()).toEqual(as.length);
      for (let i: number = 0; i < asOfs.size(); i++) {
        expect(asOfs.get(i).get()).toBe(as[i]);
      }
    });
  });

  describe('merge', () => {
    it('returns empty when argument is 0', () => {
      expect(AsOfs.merge()).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      const asOf1: MockAsOf = new MockAsOf();
      const asOf2: MockAsOf = new MockAsOf();
      const asOf3: MockAsOf = new MockAsOf();
      const asOf4: MockAsOf = new MockAsOf();
      const asOf5: MockAsOf = new MockAsOf();
      const asOfs1: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2,
        asOf3
      );
      const asOfs2: AsOfs = AsOfs.ofSpread(
        asOf4,
        asOf5
      );

      const asOfs: AsOfs = AsOfs.merge(asOfs1, asOfs2);
      expect(asOfs.size()).toEqual(5);
      expect(asOfs.get(0).get()).toEqual(asOf1);
      expect(asOfs.get(1).get()).toEqual(asOf2);
      expect(asOfs.get(2).get()).toEqual(asOf3);
      expect(asOfs.get(3).get()).toEqual(asOf4);
      expect(asOfs.get(4).get()).toEqual(asOf5);
    });
  });

  describe('duration', () => {
    it('min = max', () => {
      const min: MockAsOf = new MockAsOf({
        day: 2
      });
      const max: MockAsOf = new MockAsOf({
        day: 2
      });

      const asOfs: AsOfs = AsOfs.duration(min, max, Term.DAILY);

      expect(asOfs.size()).toEqual(3);
      expect(asOfs.get(0).get().toString()).toBe('2000-01-01');
      expect(asOfs.get(1).get().toString()).toBe('2000-01-02');
      expect(asOfs.get(2).get().toString()).toBe('2000-01-03');
    });

    it('normal case', () => {
      const min: MockAsOf = new MockAsOf({
        day: 3
      });
      const max: MockAsOf = new MockAsOf({
        day: 8
      });

      const asOfs: AsOfs = AsOfs.duration(min, max, Term.DAILY);

      expect(asOfs.size()).toEqual(8);
      expect(asOfs.get(0).get().toString()).toBe('2000-01-02');
      expect(asOfs.get(1).get().toString()).toBe('2000-01-03');
      expect(asOfs.get(2).get().toString()).toBe('2000-01-04');
      expect(asOfs.get(3).get().toString()).toBe('2000-01-05');
      expect(asOfs.get(4).get().toString()).toBe('2000-01-06');
      expect(asOfs.get(5).get().toString()).toBe('2000-01-07');
      expect(asOfs.get(6).get().toString()).toBe('2000-01-08');
      expect(asOfs.get(7).get().toString()).toBe('2000-01-09');
    });
  });

  describe('empty', () => {
    it('always empty, the length is 0', () => {
      expect(AsOfs.empty().isEmpty()).toEqual(true);
    });

    it('returns singleton instance', () => {
      expect(AsOfs.empty()).toBe(AsOfs.empty());
    });
  });

  describe('add', () => {
    it('does not affect the original one', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf3: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOf4: MockAsOf = new MockAsOf({
        day: 4
      });
      const asOfs1: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2
      );

      const asOfs2: AsOfs = asOfs1.add(asOf3, asOf4);

      expect(asOfs1.size()).toEqual(2);
      expect(asOfs1.get(0).get()).toEqual(asOf1);
      expect(asOfs1.get(1).get()).toEqual(asOf2);

      expect(asOfs2.size()).toEqual(4);
      expect(asOfs2.get(0).get()).toEqual(asOf1);
      expect(asOfs2.get(1).get()).toEqual(asOf2);
      expect(asOfs2.get(2).get()).toEqual(asOf3);
      expect(asOfs2.get(3).get()).toEqual(asOf4);
    });
  });

  describe('get', () => {
    it('returns AsOf instance at the correct index', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf3: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2,
        asOf3
      );

      expect(asOfs.size()).toEqual(3);
      expect(asOfs.get(0).get()).toBe(asOf1);
      expect(asOfs.get(1).get()).toBe(asOf2);
      expect(asOfs.get(2).get()).toBe(asOf3);
    });

    it('returns None when the index is out of range', () => {
      const asOfs: AsOfs = AsOfs.empty();

      expect(asOfs.get(-1)).toBeInstanceOf(None);
      expect(asOfs.get(0)).toBeInstanceOf(None);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the AsOfs', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf3: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOf4: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2
      );

      expect(asOfs.contains(asOf1)).toEqual(true);
      expect(asOfs.contains(asOf2)).toEqual(true);
      expect(asOfs.contains(asOf3)).toEqual(false);
      expect(asOfs.contains(asOf4)).toEqual(true);
    });
  });

  describe('min', () => {
    it('returns minimal asOf', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf3: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf4: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2,
        asOf3,
        asOf4
      );

      expect(asOfs.min().get().equals(asOf2)).toEqual(true);
    });

    it('returns asOf itself when the elements are only one', () => {
      const asOf: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf
      );

      expect(asOfs.min().get().equals(asOf)).toEqual(true);
    });

    it('returns None when AsOfs are empty', () => {
      expect(AsOfs.empty().min()).toBeInstanceOf(None);
    });

    it('returns the only one', () => {
      const asOf: MockAsOf = new MockAsOf();
      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf
      );

      expect(asOfs.min().get()).toEqual(asOf);
    });
  });

  describe('max', () => {
    it('returns minimal asOf', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf3: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf4: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2,
        asOf3,
        asOf4
      );

      expect(asOfs.max().get().equals(asOf4)).toEqual(true);
    });

    it('returns asOf itself when the elements are only one', () => {
      const asOf: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf
      );

      expect(asOfs.max().get().equals(asOf)).toEqual(true);
    });

    it('returns None when AsOfs are empty', () => {
      expect(AsOfs.empty().max()).toBeInstanceOf(None);
    });

    it('returns the only one', () => {
      const asOf: MockAsOf = new MockAsOf();
      const asOfs: AsOfs = AsOfs.ofSpread(
        asOf
      );

      expect(asOfs.max().get()).toEqual(asOf);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs1: AsOfs = AsOfs.empty();
      const asOfs2: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2
      );

      expect(asOfs1.isEmpty()).toEqual(true);
      expect(asOfs2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs1: AsOfs = AsOfs.ofSpread(
        asOf1
      );
      const asOfs2: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2
      );

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs1: AsOfs = AsOfs.ofSpread(
        asOf2,
        asOf1
      );
      const asOfs2: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2
      );

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs1: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2
      );
      const asOfs2: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2
      );

      expect(asOfs1.equals(asOfs1)).toEqual(true);
      expect(asOfs1.equals(asOfs2)).toEqual(true);
    });
  });

  describe('copy', () => {
    it('normal case, shallow copy', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs1: AsOfs = AsOfs.ofSpread(
        asOf1,
        asOf2
      );
      const asOfs2: AsOfs = asOfs1.copy();

      expect(asOfs1.size()).toEqual(asOfs2.size());
      expect(asOfs1.get(0)).toEqual(asOfs2.get(0));
      expect(asOfs1.get(1)).toEqual(asOfs2.get(1));
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const asOfs: AsOfs = AsOfs.ofSpread(
        AsOf.ofString('2000-01-01').get(),
        AsOf.ofString('2000-01-02').get(),
        AsOf.ofString('2000-01-03').get()
      );

      expect(asOfs.toJSON()).toEqual([
        '2000-01-01',
        '2000-01-02',
        '2000-01-03'
      ]);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const asOfs: AsOfs = AsOfs.ofSpread(
        AsOf.ofString('2000-01-01').get(),
        AsOf.ofString('2000-01-02').get(),
        AsOf.ofString('2000-01-03').get()
      );

      expect(asOfs.toJSON()).toEqual([
        '2000-01-01',
        '2000-01-02',
        '2000-01-03'
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const asOfs: AsOfs = AsOfs.ofSpread(
        AsOf.ofString('2000-01-01').get(),
        AsOf.ofString('2000-01-02').get(),
        AsOf.ofString('2000-01-03').get()
      );

      expect(asOfs.toString()).toEqual('2000-01-01, 2000-01-02, 2000-01-03');
    });
  });
});

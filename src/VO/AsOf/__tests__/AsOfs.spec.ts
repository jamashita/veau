import { ImmutableSequence } from '@jamashita/publikum-collection';
import { Heisenberg, Unscharferelation } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';

import { Term } from '../../Term/Term';
import { AsOf } from '../AsOf';
import { AsOfs } from '../AsOfs';
import { MockAsOf } from '../Mock/MockAsOf';

describe('AsOfs', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns AsOfs.empty()', () => {
      expect(AsOfs.of(ImmutableSequence.empty<AsOf>())).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      const sequence: ImmutableSequence<AsOf> = ImmutableSequence.of<AsOf>([
        new MockAsOf(),
        new MockAsOf(),
        new MockAsOf()
      ]);

      const asOfs: AsOfs = AsOfs.of(sequence);

      expect(asOfs.size()).toBe(sequence.size());
      for (let i: number = 0; i < asOfs.size(); i++) {
        expect(asOfs.get(i)).toBe(sequence.get(i));
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns AsOfs.empty()', () => {
      expect(AsOfs.ofArray([])).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      const as: Array<AsOf> = [new MockAsOf(), new MockAsOf(), new MockAsOf()];

      const asOfs: AsOfs = AsOfs.ofArray(as);

      expect(asOfs.size()).toBe(as.length);
      for (let i: number = 0; i < asOfs.size(); i++) {
        expect(asOfs.get(i)).toBe(as[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns AsOfs.empty()', () => {
      expect(AsOfs.ofSpread()).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      const asOf1: MockAsOf = new MockAsOf();
      const asOf2: MockAsOf = new MockAsOf();
      const asOf3: MockAsOf = new MockAsOf();

      const asOfs: AsOfs = AsOfs.ofSpread(asOf1, asOf2, asOf3);

      expect(asOfs.size()).toBe(3);
      expect(asOfs.get(0)).toBe(asOf1);
      expect(asOfs.get(1)).toBe(asOf2);
      expect(asOfs.get(2)).toBe(asOf3);
    });
  });

  describe('merge', () => {
    it('returns AsOfs.empty() when argument is 0', () => {
      expect(AsOfs.merge()).toBe(AsOfs.empty());
    });

    it('returns asOfs itself when argument is 1', () => {
      const asOfs: AsOfs = AsOfs.ofArray([new MockAsOf(), new MockAsOf(), new MockAsOf()]);

      expect(AsOfs.merge(asOfs)).toBe(asOfs);
    });

    it('normal case', () => {
      const asOf1: MockAsOf = new MockAsOf();
      const asOf2: MockAsOf = new MockAsOf();
      const asOf3: MockAsOf = new MockAsOf();
      const asOf4: MockAsOf = new MockAsOf();
      const asOf5: MockAsOf = new MockAsOf();
      const asOfs1: AsOfs = AsOfs.ofArray([asOf1, asOf2, asOf3]);
      const asOfs2: AsOfs = AsOfs.ofArray([asOf4, asOf5]);

      const asOfs: AsOfs = AsOfs.merge(asOfs1, asOfs2);

      expect(asOfs.size()).toBe(5);
      expect(asOfs.get(0)).toBe(asOf1);
      expect(asOfs.get(1)).toBe(asOf2);
      expect(asOfs.get(2)).toBe(asOf3);
      expect(asOfs.get(3)).toBe(asOf4);
      expect(asOfs.get(4)).toBe(asOf5);
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

      expect(asOfs.size()).toBe(3);
      expect(asOfs.get(0)?.toString()).toBe('2000-01-01');
      expect(asOfs.get(1)?.toString()).toBe('2000-01-02');
      expect(asOfs.get(2)?.toString()).toBe('2000-01-03');
    });

    it('normal case', () => {
      const min: MockAsOf = new MockAsOf({
        day: 3
      });
      const max: MockAsOf = new MockAsOf({
        day: 8
      });

      const asOfs: AsOfs = AsOfs.duration(min, max, Term.DAILY);

      expect(asOfs.size()).toBe(8);
      expect(asOfs.get(0)?.toString()).toBe('2000-01-02');
      expect(asOfs.get(1)?.toString()).toBe('2000-01-03');
      expect(asOfs.get(2)?.toString()).toBe('2000-01-04');
      expect(asOfs.get(3)?.toString()).toBe('2000-01-05');
      expect(asOfs.get(4)?.toString()).toBe('2000-01-06');
      expect(asOfs.get(5)?.toString()).toBe('2000-01-07');
      expect(asOfs.get(6)?.toString()).toBe('2000-01-08');
      expect(asOfs.get(7)?.toString()).toBe('2000-01-09');
    });
  });

  describe('empty', () => {
    it('always empty, the length is 0', () => {
      expect(AsOfs.empty().isEmpty()).toBe(true);
    });

    it('returns singleton instance', () => {
      expect(AsOfs.empty()).toBe(AsOfs.empty());
    });
  });

  describe('add', () => {
    it('returns itself when the argument is 0', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs: AsOfs = AsOfs.ofArray([asOf1, asOf2]);

      expect(asOfs.add()).toBe(asOfs);
    });

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
      const asOfs1: AsOfs = AsOfs.ofArray([asOf1, asOf2]);

      const asOfs2: AsOfs = asOfs1.add(asOf3, asOf4);

      expect(asOfs1.size()).toBe(2);
      expect(asOfs1.get(0)).toBe(asOf1);
      expect(asOfs1.get(1)).toBe(asOf2);

      expect(asOfs2.size()).toBe(4);
      expect(asOfs2.get(0)).toBe(asOf1);
      expect(asOfs2.get(1)).toBe(asOf2);
      expect(asOfs2.get(2)).toBe(asOf3);
      expect(asOfs2.get(3)).toBe(asOf4);
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
      const asOfs: AsOfs = AsOfs.ofArray([asOf1, asOf2, asOf3]);

      expect(asOfs.size()).toBe(3);
      expect(asOfs.get(0)).toBe(asOf1);
      expect(asOfs.get(1)).toBe(asOf2);
      expect(asOfs.get(2)).toBe(asOf3);
    });

    it('returns null when the index is out of range', () => {
      const asOfs: AsOfs = AsOfs.empty();

      expect(asOfs.get(-1)).toBe(null);
      expect(asOfs.get(0)).toBe(null);
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
      const asOfs: AsOfs = AsOfs.ofArray([asOf1, asOf2]);

      expect(asOfs.contains(asOf1)).toBe(true);
      expect(asOfs.contains(asOf2)).toBe(true);
      expect(asOfs.contains(asOf3)).toBe(false);
      expect(asOfs.contains(asOf4)).toBe(true);
    });
  });

  describe('min', () => {
    it('returns minimal asOf', async () => {
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
      const asOfs: AsOfs = AsOfs.ofArray([asOf1, asOf2, asOf3, asOf4]);
      const a: AsOf = await asOfs.min().get();

      expect(a.equals(asOf2)).toBe(true);
    });

    it('returns asOf itself when the elements are only one', async () => {
      const asOf: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOfs: AsOfs = AsOfs.ofArray([asOf]);
      const a: AsOf = await asOfs.min().get();

      expect(a).toBe(asOf);
    });

    it('returns null when AsOfs are empty', async () => {
      const unscharferelation: Unscharferelation<AsOf> = AsOfs.empty().min();
      const heisenberg: Heisenberg<AsOf> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
    });
  });

  describe('max', () => {
    it('returns minimal asOf', async () => {
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
      const asOfs: AsOfs = AsOfs.ofArray([asOf1, asOf2, asOf3, asOf4]);
      const a: AsOf = await asOfs.max().get();

      expect(a.equals(asOf4)).toBe(true);
    });

    it('returns asOf itself when the elements are only one', async () => {
      const asOf: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOfs: AsOfs = AsOfs.ofArray([asOf]);
      const a: AsOf = await asOfs.max().get();

      expect(a).toBe(asOf);
    });

    it('returns null when AsOfs are empty', async () => {
      const unscharferelation: Unscharferelation<AsOf> = AsOfs.empty().max();
      const heisenberg: Heisenberg<AsOf> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
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
      const asOfs2: AsOfs = AsOfs.ofArray([asOf1, asOf2]);

      expect(asOfs1.isEmpty()).toBe(true);
      expect(asOfs2.isEmpty()).toBe(false);
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
      const asOfs1: AsOfs = AsOfs.ofArray([asOf1]);
      const asOfs2: AsOfs = AsOfs.ofArray([asOf1, asOf2]);

      expect(asOfs1.equals(asOfs1)).toBe(true);
      expect(asOfs1.equals(asOfs2)).toBe(false);
    });

    it('returns false if the sequence is different', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs1: AsOfs = AsOfs.ofArray([asOf2, asOf1]);
      const asOfs2: AsOfs = AsOfs.ofArray([asOf1, asOf2]);

      expect(asOfs1.equals(asOfs1)).toBe(true);
      expect(asOfs1.equals(asOfs2)).toBe(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs1: AsOfs = AsOfs.ofArray([asOf1, asOf2]);
      const asOfs2: AsOfs = AsOfs.ofArray([asOf1, asOf2]);

      expect(asOfs1.equals(asOfs1)).toBe(true);
      expect(asOfs1.equals(asOfs2)).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('normal case, shallow duplicate', async () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs1: AsOfs = AsOfs.ofArray([asOf1, asOf2]);
      const asOfs2: AsOfs = asOfs1.duplicate();

      expect(asOfs1).not.toBe(asOfs2);
      expect(asOfs1.size()).toBe(asOfs2.size());
      for (let i: number = 0; i < asOfs1.size(); i++) {
        const a1: Nullable<AsOf> = asOfs1.get(i);
        const a2: Nullable<AsOf> = asOfs2.get(i);

        if (a1 === null) {
          fail();

          return;
        }
        if (a2 === null) {
          fail();

          return;
        }

        expect(a1.equals(a2)).toBe(true);
      }
    });

    it('returns AsOfs.empty() when original AsOfs is empty', () => {
      const asOfs: AsOfs = AsOfs.ofArray([]);

      expect(asOfs.duplicate()).toBe(asOfs);
    });
  });

  describe('toJSON', () => {
    it('normal case', async () => {
      const asOfs: AsOfs = AsOfs.ofArray([
        await AsOf.ofString('2000-01-01').get(),
        await AsOf.ofString('2000-01-02').get(),
        await AsOf.ofString('2000-01-03').get()
      ]);

      expect(asOfs.toJSON()).toEqual(['2000-01-01', '2000-01-02', '2000-01-03']);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const asOfs: AsOfs = AsOfs.ofArray([
        await AsOf.ofString('2000-01-01').get(),
        await AsOf.ofString('2000-01-02').get(),
        await AsOf.ofString('2000-01-03').get()
      ]);

      expect(asOfs.toString()).toBe('2000-01-01, 2000-01-02, 2000-01-03');
    });
  });
});

import { ImmutableSequence, MockSequence } from '@jamashita/publikum-collection';
import { Nullable } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';

import { Term } from '../../Term/Term';
import { AsOf } from '../AsOf';
import { AsOfs } from '../AsOfs';
import { MockAsOf } from '../Mock/MockAsOf';

describe('AsOfs', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns AsOfs.empty()', () => {
      expect.assertions(1);

      expect(AsOfs.of(ImmutableSequence.empty<AsOf>())).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      expect.assertions(4);

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
      expect.assertions(1);

      expect(AsOfs.ofArray([])).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      expect.assertions(4);

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
      expect.assertions(1);

      expect(AsOfs.ofSpread()).toBe(AsOfs.empty());
    });

    it('normal case', () => {
      expect.assertions(4);

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
      expect.assertions(1);

      expect(AsOfs.merge()).toBe(AsOfs.empty());
    });

    it('returns asOfs itself when argument is 1', () => {
      expect.assertions(1);

      const asOfs: AsOfs = AsOfs.ofArray([new MockAsOf(), new MockAsOf(), new MockAsOf()]);

      expect(AsOfs.merge(asOfs)).toBe(asOfs);
    });

    it('normal case', () => {
      expect.assertions(6);

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
      expect.assertions(4);

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
      expect.assertions(9);

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
      expect.assertions(1);

      expect(AsOfs.empty().isEmpty()).toBe(true);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(AsOfs.empty()).toBe(AsOfs.empty());
    });
  });

  describe('add', () => {
    it('returns itself when the argument is 0', () => {
      expect.assertions(1);

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
      expect.assertions(8);

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
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.get = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.get(0);

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);
      const asOf: MockAsOf = new MockAsOf();

      const spy: SinonSpy = sinon.spy();

      sequence.contains = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.contains(asOf);

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.size = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.forEach = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('min', () => {
    it('returns minimal asOf', () => {
      expect.assertions(1);

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
      const a: Nullable<AsOf> = asOfs.min();

      expect(a?.equals(asOf2)).toBe(true);
    });

    it('returns asOf itself when the elements are only one', () => {
      expect.assertions(1);

      const asOf: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOfs: AsOfs = AsOfs.ofArray([asOf]);
      const a: Nullable<AsOf> = asOfs.min();

      expect(a).toBe(asOf);
    });

    it('returns null when AsOfs are empty', () => {
      expect.assertions(1);

      expect(AsOfs.empty().min()).toBeNull();
    });
  });

  describe('max', () => {
    it('returns minimal asOf', () => {
      expect.assertions(1);

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
      const a: Nullable<AsOf> = asOfs.max();

      expect(a?.equals(asOf4)).toBe(true);
    });

    it('returns asOf itself when the elements are only one', () => {
      expect.assertions(1);

      const asOf: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOfs: AsOfs = AsOfs.ofArray([asOf]);
      const a: Nullable<AsOf> = asOfs.max();

      expect(a).toBe(asOf);
    });

    it('returns null when AsOfs are empty', () => {
      expect.assertions(1);

      expect(AsOfs.empty().max()).toBeNull();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.isEmpty = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      expect.assertions(1);

      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOfs: AsOfs = AsOfs.ofArray([asOf1, asOf2]);

      expect(asOfs.equals(asOfs)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });

      const spy: SinonSpy = sinon.spy();

      sequence.equals = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.equals(AsOfs.ofArray([asOf1, asOf2]));

      expect(spy.called).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('normal case, shallow duplicate', () => {
      expect.assertions(4);

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
      expect.assertions(1);

      const asOfs: AsOfs = AsOfs.ofArray([]);

      expect(asOfs.duplicate()).toBe(asOfs);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const asOfs: AsOfs = AsOfs.ofArray([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      expect(asOfs.toJSON()).toStrictEqual(['2000-01-01', '2000-01-02', '2000-01-03']);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.toString = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(3);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      const asOfs: AsOfs = AsOfs.of(sequence);

      let i: number = 0;

      for (const pair of asOfs) {
        expect(pair.getValue()).toBe(sequence.get(i));
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.every = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<AsOf> = new MockSequence<AsOf>([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.some = spy;

      const asOfs: AsOfs = AsOfs.of(sequence);

      asOfs.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});

import { MockNominative } from '../../../Mock/MockNominative';
import { ImmutableSequence } from '../ImmutableSequence';

describe('ImmutableSequence', () => {
  describe('of', () => {
    it('when the arguments specified with 0 length array, returns singleton', () => {
      const sequence: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([]);

      expect(sequence.isEmpty()).toEqual(true);
      expect(sequence).toBe(ImmutableSequence.empty<MockNominative<number>>());
    });

    it('normal case', () => {
      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(3)
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(5)
      ]);

      expect(sequence1.size()).toEqual(2);
      expect(sequence2.size()).toEqual(3);
    });
  });

  describe('empty', () => {
    it('always empty, the length is 0', () => {
      const sequence: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();

      expect(sequence.isEmpty()).toEqual(true);
    });

    it('returns singleton empty Sequence', () => {
      expect(ImmutableSequence.empty<MockNominative<number>>()).toEqual(ImmutableSequence.empty<MockNominative<string>>());
    });
  });

  describe('add', () => {
    it('returns itself when arguments are empty', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();

      expect(nouns1.add()).toBe(nouns1);
      expect(nouns2.add()).toBe(nouns2);
    });

    it('can extend immutably', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();

      expect(nouns1.size()).toEqual(0);

      const nouns2: ImmutableSequence<MockNominative<number>> = nouns1.add(noun1);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(1);
      expect(nouns2.get(0).get()).toBe(noun1);

      const nouns3: ImmutableSequence<MockNominative<number>> = nouns2.add(noun2);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).not.toBe(nouns3);
      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(1);
      expect(nouns3.size()).toEqual(2);
      expect(nouns3.get(0).get()).toBe(noun1);
      expect(nouns3.get(1).get()).toBe(noun2);

      const nouns4: ImmutableSequence<MockNominative<number>> = nouns3.add(noun3);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).not.toBe(nouns3);
      expect(nouns3).not.toBe(nouns4);
      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(1);
      expect(nouns3.size()).toEqual(2);
      expect(nouns4.size()).toEqual(3);
      expect(nouns4.get(0).get()).toBe(noun1);
      expect(nouns4.get(1).get()).toBe(noun2);
      expect(nouns4.get(2).get()).toBe(noun3);
    });

    it('apply spread syntax', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();

      expect(nouns1.size()).toEqual(0);

      const nouns2: ImmutableSequence<MockNominative<number>> = nouns1.add(noun1, noun2);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(2);
      expect(nouns2.get(0).get()).toBe(noun1);
      expect(nouns2.get(1).get()).toBe(noun2);

      const nouns3: ImmutableSequence<MockNominative<number>> = nouns2.add(noun3, noun4);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).not.toBe(nouns3);
      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(2);
      expect(nouns3.size()).toEqual(4);
      expect(nouns3.get(0).get()).toBe(noun1);
      expect(nouns3.get(1).get()).toBe(noun2);
      expect(nouns3.get(2).get()).toBe(noun3);
      expect(nouns3.get(3).get()).toBe(noun4);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([]);

      expect(nouns1.isEmpty()).toEqual(false);
      expect(nouns2.isEmpty()).toEqual(true);
    });
  });

  describe('map', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: ImmutableSequence<MockNominative<string>> = nouns1.map<MockNominative<string>>((noun: MockNominative<number>, index: number) => {
        const num: number = noun.get();
        return new MockNominative<string>(`${num ** 2}`);
      });

      expect(nouns2.size()).toEqual(nouns1.size());
      nouns2.forEach((noun: MockNominative<string>, index: number) => {
        const value: number = nouns1.get(index).get().get() ** 2;

        expect(noun.get()).toBe(value.toString());
      });
    });

    it('returns empty sequence when ImmutableSequence is empty', () => {
      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([]);

      const map1: ImmutableSequence<MockNominative<number>> = nouns1.map((mock: MockNominative<number>) => {
        return mock;
      });
      const map2: ImmutableSequence<MockNominative<number>> = nouns2.map((mock: MockNominative<number>) => {
        return mock;
      });

      expect(nouns1).toBe(nouns2);
      expect(nouns2).toBe(map1);
      expect(map1).toBe(map2);
      expect(map2).toBe(ImmutableSequence.empty<MockNominative<number>>());
    });
  });

  describe('filter', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);
      const noun5: MockNominative<number> = new MockNominative<number>(5);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);

      const filtered1: ImmutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const filtered2: ImmutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        if (mock === noun4) {
          return true;
        }

        return false;
      });
      const filtered3: ImmutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        if (mock === noun5) {
          return true;
        }

        return false;
      });

      expect(filtered1.size()).toEqual(2);
      expect(filtered1.get(0).get()).toBe(noun2);
      expect(filtered1.get(1).get()).toBe(noun4);
      expect(filtered2.size()).toEqual(1);
      expect(filtered2.get(0).get()).toBe(noun4);
      expect(filtered3.size()).toEqual(0);
    });

    it('returns empty sequence when screen returns nothing', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);

      const filtered: ImmutableSequence<MockNominative<number>> = nouns.filter(() => {
        return false;
      });

      expect(filtered.size()).toEqual(0);
      expect(filtered).toBe(ImmutableSequence.empty<MockNominative<number>>());
    });
  });

  describe('copy', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = nouns1.copy();

      expect(nouns1.size()).toEqual(nouns2.size());
      expect(nouns1).not.toBe(nouns2);
      for (let i: number = 0; i < nouns2.size(); i++) {
        expect(nouns1.get(i).get()).toBe(nouns2.get(i).get());
      }
    });

    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = nouns1.copy();
      const nouns3: ImmutableSequence<MockNominative<number>> = nouns2.add(noun4);

      expect(nouns1.size()).toEqual(nouns2.size());
      expect(nouns2.size()).not.toEqual(nouns3.size());
      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).not.toBe(nouns3);
    });
  });
});

import { MockNominative } from '../../MockNominative';
import { Sequence } from '../Sequence';

describe('Sequence', () => {
  describe('[Symbol.iterator]', () => {
    it('can iterate for loop', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      let i: number = 0;
      for (const noun of nouns) {
        expect(nouns.get(i).get()).toBe(noun);
        i++;
      }

      expect(i).toEqual(nouns.size());
    });
  });

  describe('get', () => {
    it('returns MockNominative instance at the correct index', ()  => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      expect(nouns.size()).toEqual(3);
      expect(nouns.get(0).get()).toEqual(noun1);
      expect(nouns.get(1).get()).toEqual(noun2);
      expect(nouns.get(2).get()).toEqual(noun3);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the AsOfs', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns.contains(noun1)).toEqual(true);
      expect(nouns.contains(noun2)).toEqual(true);
      expect(nouns.contains(noun3)).toEqual(false);
      expect(nouns.contains(noun4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);
      const nouns2: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
      ]);

      expect(nouns1.isEmpty()).toEqual(false);
      expect(nouns2.isEmpty()).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1
      ]);
      const nouns2: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns1.equals(nouns1)).toEqual(true);
      expect(nouns1.equals(nouns2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun2,
        noun1
      ]);
      const nouns2: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns1.equals(nouns1)).toEqual(true);
      expect(nouns1.equals(nouns2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);
      const nouns2: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns1.equals(nouns1)).toEqual(true);
      expect(nouns1.equals(nouns2)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: Sequence<MockNominative<number>> = Sequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      expect(nouns.toString()).toEqual('1, 2, 3');
    });
  });

  describe('empty', () => {
    it('always empty, the length is 0', () => {
      const sequence: Sequence<MockNominative<number>> = Sequence.empty();

      expect(sequence.isEmpty()).toEqual(true);
    });
  });

});

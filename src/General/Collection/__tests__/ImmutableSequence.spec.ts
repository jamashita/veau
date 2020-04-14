import { MockNominative } from '../../MockNominative';
import { None } from '../../Optional/None';
import { Optional } from '../../Optional/Optional';
import { ImmutableSequence } from '../ImmutableSequence';

// DONE
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
  });

  describe('add', () => {
    it('can extends immutably', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();

      expect(nouns1.size()).toEqual(0);

      const nouns2: ImmutableSequence<MockNominative<number>> = nouns1.add(noun1);

      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(1);
      expect(nouns2.get(0).get()).toEqual(noun1);

      const nouns3: ImmutableSequence<MockNominative<number>> = nouns2.add(noun2);

      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(1);
      expect(nouns3.size()).toEqual(2);
      expect(nouns3.get(0).get()).toEqual(noun1);
      expect(nouns3.get(1).get()).toEqual(noun2);

      const nouns4: ImmutableSequence<MockNominative<number>> = nouns3.add(noun3);

      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(1);
      expect(nouns3.size()).toEqual(2);
      expect(nouns4.size()).toEqual(3);
      expect(nouns4.get(0).get()).toEqual(noun1);
      expect(nouns4.get(1).get()).toEqual(noun2);
      expect(nouns4.get(2).get()).toEqual(noun3);
    });

    it('apply spread syntax', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();

      expect(nouns1.size()).toEqual(0);

      const nouns2: ImmutableSequence<MockNominative<number>> = nouns1.add(noun1, noun2);

      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(2);
      expect(nouns2.get(0).get()).toEqual(noun1);
      expect(nouns2.get(1).get()).toEqual(noun2);

      const nouns3: ImmutableSequence<MockNominative<number>> = nouns2.add(noun3, noun4);

      expect(nouns1.size()).toEqual(0);
      expect(nouns2.size()).toEqual(2);
      expect(nouns3.size()).toEqual(4);
      expect(nouns3.get(0).get()).toEqual(noun1);
      expect(nouns3.get(1).get()).toEqual(noun2);
      expect(nouns3.get(2).get()).toEqual(noun3);
      expect(nouns3.get(3).get()).toEqual(noun4);
    });
  });

  describe('get', () => {
    it('returns Some<MockNominative> instance at the correct index', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      expect(nouns.size()).toEqual(3);
      expect(nouns.get(0).get()).toEqual(noun1);
      expect(nouns.get(1).get()).toEqual(noun2);
      expect(nouns.get(2).get()).toEqual(noun3);
    });

    it('returns None<MockNominative> instance at out of index', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      expect(nouns.size()).toEqual(3);
      expect(nouns.get(-1)).toBeInstanceOf(None);
      expect(nouns.get(3)).toBeInstanceOf(None);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the AsOfs', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
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

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([]);

      expect(nouns1.isEmpty()).toEqual(false);
      expect(nouns2.isEmpty()).toEqual(true);
    });
  });

  describe('iterate', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      nouns.forEach((noun: MockNominative<number>, index: number) => {
        expect(nouns.get(index).get()).toEqual(noun);
      });
    });
  });

  describe('project', () => {
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
      expect(nouns2.get(0).get().get()).toEqual('1');
      expect(nouns2.get(1).get().get()).toEqual('4');
      expect(nouns2.get(2).get().get()).toEqual('9');
    });

    it('returns empty sequence when ImmutableSequence is empty', () => {
      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([]);

      const project1: ImmutableSequence<MockNominative<number>> = nouns1.map((mock: MockNominative<number>) => {
        return mock;
      });
      const project2: ImmutableSequence<MockNominative<number>> = nouns2.map((mock: MockNominative<number>) => {
        return mock;
      });

      expect(nouns1).toBe(nouns2);
      expect(nouns2).toBe(project1);
      expect(project1).toBe(project2);
      expect(project2).toBe(ImmutableSequence.empty<MockNominative<number>>());
    });
  });

  describe('select', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);

      const select1: Optional<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() === 1) {
          return true;
        }

        return false;
      });
      const select2: Optional<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() === 2) {
          return true;
        }

        return false;
      });
      const select3: Optional<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const select4: Optional<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() > 1000) {
          return true;
        }

        return false;
      });

      expect(select1.isPresent()).toEqual(true);
      expect(select1.get()).toEqual(noun1);
      expect(select2.isPresent()).toEqual(true);
      expect(select2.get()).toEqual(noun2);
      expect(select3.isPresent()).toEqual(true);
      expect(select3.get()).toEqual(noun2);
      expect(select4.isAbsent()).toEqual(true);
    });
  });

  describe('screen', () => {
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

      const screen1: ImmutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const screen2: ImmutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        if (mock === noun4) {
          return true;
        }

        return false;
      });
      const screen3: ImmutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        if (mock === noun5) {
          return true;
        }

        return false;
      });

      expect(screen1.size()).toEqual(2);
      expect(screen1.get(0).get()).toEqual(noun2);
      expect(screen1.get(1).get()).toEqual(noun4);
      expect(screen2.size()).toEqual(1);
      expect(screen2.get(0).get()).toEqual(noun4);
      expect(screen3.size()).toEqual(0);
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

      const screen: ImmutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        return false;
      });

      expect(screen.size()).toEqual(0);
      expect(screen).toBe(ImmutableSequence.empty<MockNominative<number>>());
    });
  });

  describe('every', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(2);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);

      const every: boolean = nouns.every((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });

      expect(every).toEqual(true);
    });

    it('if one of them are not satisfied, returns false', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun2,
        noun1,
        noun3,
        noun4
      ]);
      const nouns3: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun2,
        noun3,
        noun1,
        noun4
      ]);
      const nouns4: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun2,
        noun3,
        noun4,
        noun1
      ]);
      const nouns5: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun5,
        noun3,
        noun4
      ]);
      const nouns6: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun5,
        noun4
      ]);

      const every1: boolean = nouns1.every((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const every2: boolean = nouns2.every((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const every3: boolean = nouns3.every((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const every4: boolean = nouns4.every((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const every5: boolean = nouns5.every((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const every6: boolean = nouns6.every((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });

      expect(every1).toEqual(false);
      expect(every2).toEqual(false);
      expect(every3).toEqual(false);
      expect(every4).toEqual(false);
      expect(every5).toEqual(false);
      expect(every6).toEqual(false);
    });
  });

  describe('some', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(2);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);

      const some1: boolean = nouns.some((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const some2: boolean = nouns.some((mock: MockNominative<number>) => {
        if (mock.get() === 2) {
          return true;
        }

        return false;
      });

      expect(some1).toEqual(true);
      expect(some2).toEqual(true);
    });

    it('if none of them are not satisfied, returns false', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(10);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun2,
        noun1,
        noun3,
        noun4
      ]);
      const nouns3: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun2,
        noun3,
        noun1,
        noun4
      ]);
      const nouns4: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun2,
        noun3,
        noun4,
        noun1
      ]);
      const nouns5: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun2,
        noun3,
        noun4,
        noun5
      ]);

      const some1: boolean = nouns1.some((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 1) {
          return true;
        }

        return false;
      });
      const some2: boolean = nouns2.some((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 1) {
          return true;
        }

        return false;
      });
      const some3: boolean = nouns3.some((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 1) {
          return true;
        }

        return false;
      });
      const some4: boolean = nouns4.some((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 1) {
          return true;
        }

        return false;
      });
      const some5: boolean = nouns5.some((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 1) {
          return true;
        }

        return false;
      });

      expect(some1).toEqual(true);
      expect(some2).toEqual(true);
      expect(some3).toEqual(true);
      expect(some4).toEqual(true);
      expect(some5).toEqual(false);
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

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns1.equals(nouns1)).toEqual(true);
      expect(nouns1.equals(nouns2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun2,
        noun1
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns1.equals(nouns1)).toEqual(true);
      expect(nouns1.equals(nouns2)).toEqual(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2
      ]);
      const nouns2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
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

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      expect(nouns.toString()).toEqual('1, 2, 3');
    });
  });

  describe('toArray', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);
      const array: Array<MockNominative<number>> = nouns.toArray();

      expect(nouns.size()).toEqual(array.length);
      for (let i: number = 0; i < array.length; i++) {
        expect(nouns.get(i).get()).toEqual(array[i]);
      }
    });

    it('does not return the array itself', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const elements: Array<MockNominative<number>> = [
        noun1,
        noun2,
        noun3
      ];
      const nouns: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>(elements);
      expect(nouns.toArray()).not.toBe(elements);
    });
  });
});
import { MockNominative } from '../../../Mock/MockNominative';
import { Absent } from '../../../Quantum/Absent';
import { Quantum } from '../../../Quantum/Quantum';
import { MockASequence } from '../Mock/MockASequence';

describe('ASequence', () => {
  describe('get', () => {
    it('returns Present instance at the correct index', () => {
      const nounArray: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ];

      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>(nounArray);
      expect(nouns.size()).toBe(nounArray.length);
      for (let i: number = 0; i < nouns.size(); i++) {
        expect(nouns.get(i).get()).toBe(nounArray[i]);
      }
    });

    it('returns Absent instance at out of index', () => {
      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(nouns.size()).toBe(3);
      expect(nouns.get(-1)).toBeInstanceOf(Absent);
      expect(nouns.get(3)).toBeInstanceOf(Absent);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);

      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns.contains(noun1)).toBe(true);
      expect(nouns.contains(noun2)).toBe(true);
      expect(nouns.contains(noun3)).toBe(false);
      expect(nouns.contains(noun4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const nouns1: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);
      const nouns2: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([]);

      expect(nouns1.isEmpty()).toBe(false);
      expect(nouns2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('normal case', () => {
      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(nouns.size()).toBe(3);
      nouns.forEach((noun: MockNominative<number>, index: number) => {
        expect(nouns.get(index).get()).toBe(noun);
      });
    });
  });

  describe('find', () => {
    it('normal case', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);

      const found1: Quantum<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() === 1) {
          return true;
        }

        return false;
      });
      const found2: Quantum<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() === 2) {
          return true;
        }

        return false;
      });
      const found3: Quantum<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });
      const found4: Quantum<MockNominative<number>> = nouns.find((mock: MockNominative<number>) => {
        if (mock.get() > 1000) {
          return true;
        }

        return false;
      });

      expect(found1.isPresent()).toBe(true);
      expect(found1.get()).toBe(noun1);
      expect(found2.isPresent()).toBe(true);
      expect(found2.get()).toBe(noun2);
      expect(found3.isPresent()).toBe(true);
      expect(found3.get()).toBe(noun2);
      expect(found4.isAbsent()).toBe(true);
    });
  });

  describe('every', () => {
    it('normal case', () => {
      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(6),
        new MockNominative<number>(8)
      ]);

      const every: boolean = nouns.every((mock: MockNominative<number>) => {
        if (mock.get() % 2 === 0) {
          return true;
        }

        return false;
      });

      expect(every).toBe(true);
    });

    it('if one of them are not satisfied, returns false', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);
      const nouns2: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun2,
        noun1,
        noun3,
        noun4
      ]);
      const nouns3: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun2,
        noun3,
        noun1,
        noun4
      ]);
      const nouns4: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun2,
        noun3,
        noun4,
        noun1
      ]);
      const nouns5: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun5,
        noun3,
        noun4
      ]);
      const nouns6: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
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

      expect(every1).toBe(false);
      expect(every2).toBe(false);
      expect(every3).toBe(false);
      expect(every4).toBe(false);
      expect(every5).toBe(false);
      expect(every6).toBe(false);
    });
  });

  describe('some', () => {
    it('normal case', () => {
      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(6),
        new MockNominative<number>(8)
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

      expect(some1).toBe(true);
      expect(some2).toBe(true);
    });

    it('if none of them are not satisfied, returns false', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(4);
      const noun3: MockNominative<number> = new MockNominative<number>(6);
      const noun4: MockNominative<number> = new MockNominative<number>(8);
      const noun5: MockNominative<number> = new MockNominative<number>(10);

      const nouns1: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);
      const nouns2: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun2,
        noun1,
        noun3,
        noun4
      ]);
      const nouns3: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun2,
        noun3,
        noun1,
        noun4
      ]);
      const nouns4: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun2,
        noun3,
        noun4,
        noun1
      ]);
      const nouns5: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
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

      expect(some1).toBe(true);
      expect(some2).toBe(true);
      expect(some3).toBe(true);
      expect(some4).toBe(true);
      expect(some5).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1
      ]);
      const nouns2: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(false);
    });

    it('returns false if the sequence is different', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun2,
        noun1
      ]);
      const nouns2: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun2
      ]);
      const nouns2: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        noun1,
        noun2
      ]);

      expect(nouns1.equals(nouns1)).toBe(true);
      expect(nouns1.equals(nouns2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(nouns.toString()).toBe('1, 2, 3');
    });
  });

  describe('toArray', () => {
    it('normal case', () => {
      const nounArray: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ];

      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>(nounArray);

      expect(nouns.size()).toBe(nounArray.length);
      for (let i: number = 0; i < nounArray.length; i++) {
        expect(nouns.get(i).get()).toBe(nounArray[i]);
      }
    });

    it('does not return the array itself', () => {
      const nounArrray: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ];

      const nouns: MockASequence<MockNominative<number>> = new MockASequence<MockNominative<number>>(nounArrray);

      expect(nouns.toArray()).not.toBe(nounArrray);
    });
  });
});

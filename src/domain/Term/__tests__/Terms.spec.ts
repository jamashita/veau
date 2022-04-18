import { ImmutableProject, MockProject } from '@jamashita/lluvia-project';
import { Term } from '../Term';
import { TermID } from '../TermID';
import { Terms } from '../Terms';

describe('Terms', () => {
  describe('all', () => {
    it('is singleton instance', () => {
      expect(Terms.all()).toBe(Terms.all());
    });

    it('the length is 5', () => {
      expect(Terms.all().size()).toBe(5);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      const project: MockProject<TermID, Term> = new MockProject(
        new Map([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(project, 'get');

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.get(Term.MONTHLY.getTermID());

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      const project: MockProject<TermID, Term> = new MockProject(
        new Map([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(project, 'contains');

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.contains(Term.MONTHLY);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      const project: MockProject<TermID, Term> = new MockProject(
        new Map([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(project, 'isEmpty');

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.isEmpty();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      const project: MockProject<TermID, Term> = new MockProject(
        new Map([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(project, 'forEach');

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.forEach(() => {
        // NOOP
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('does not affect the original length', () => {
      const terms: Terms = Terms.all();

      const mapped: ImmutableProject<TermID, Term> = terms.map((term: Term): Term => {
        return term;
      });

      expect(mapped.size()).toBe(5);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const terms: Terms = Terms.all();

      expect(terms.equals(null)).toBe(false);
      expect(terms.equals(undefined)).toBe(false);
      expect(terms.equals('')).toBe(false);
      expect(terms.equals('123')).toBe(false);
      expect(terms.equals('abcd')).toBe(false);
      expect(terms.equals(123)).toBe(false);
      expect(terms.equals(0)).toBe(false);
      expect(terms.equals(-12)).toBe(false);
      expect(terms.equals(0.3)).toBe(false);
      expect(terms.equals(false)).toBe(false);
      expect(terms.equals(true)).toBe(false);
      expect(terms.equals(Symbol('p'))).toBe(false);
      expect(terms.equals(20n)).toBe(false);
      expect(terms.equals({})).toBe(false);
      expect(terms.equals([])).toBe(false);
      expect(terms.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the same instance given', () => {
      expect(Terms.all()).toBe(Terms.all());
    });
  });

  describe('iterator', () => {
    it('returns [TermID, Term]', () => {
      const terms: Terms = Terms.all();
      let i: number = 0;

      for (const [, v] of terms) {
        switch (i) {
          case 0: {
            expect(v).toBe(Term.DAILY);
            i++;
            break;
          }
          case 1: {
            expect(v).toBe(Term.WEEKLY);
            i++;
            break;
          }
          case 2: {
            expect(v).toBe(Term.MONTHLY);
            i++;
            break;
          }
          case 3: {
            expect(v).toBe(Term.QUARTERLY);
            i++;
            break;
          }
          case 4: {
            expect(v).toBe(Term.ANNUAL);
            i++;
            break;
          }
          default: {
            fail();
          }
        }
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      const project: MockProject<TermID, Term> = new MockProject(
        new Map([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(project, 'every');

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.every(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      const project: MockProject<TermID, Term> = new MockProject(
        new Map([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(project, 'some');

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.some(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      const project: MockProject<TermID, Term> = new MockProject(
        new Map([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(project, 'values');

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.values();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('returns matching elements by predicate', () => {
      const terms: Terms = Terms.all();

      const filtered: Terms = terms.filter((t: Term) => {
        return t === Term.DAILY;
      });

      expect(filtered.size()).toBe(1);
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      const project: MockProject<TermID, Term> = new MockProject(
        new Map([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(project, 'find');

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.find(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});

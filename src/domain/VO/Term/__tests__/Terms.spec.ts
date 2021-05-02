import { ImmutableProject, MockProject } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { Term } from '../Term';
import { TermID } from '../TermID';
import { Terms } from '../Terms';

describe('Terms', () => {
  describe('all', () => {
    it('is singleton instance', () => {
      expect.assertions(1);

      expect(Terms.all()).toBe(Terms.all());
    });

    it('the length is 5', () => {
      expect.assertions(1);

      expect(Terms.all().size()).toBe(5);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.get = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.get(Term.MONTHLY.getTermID());

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.contains = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.contains(Term.MONTHLY);

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.isEmpty = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.forEach = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('does not affect the original length', () => {
      expect.assertions(1);

      const terms: Terms = Terms.all();

      const mapped: ImmutableProject<TermID, TermID> = terms.map<TermID>((term: Term) => {
        return term.getTermID();
      });

      expect(mapped.size()).toBe(5);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

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
      expect.assertions(1);

      expect(Terms.all()).toBe(Terms.all());
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.toString = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('returns [TermID, Term]', () => {
      expect.assertions(5);

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
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.every = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.some = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.values = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.values();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('returns matching elements by predicate', () => {
      expect.assertions(1);

      const terms: Terms = Terms.all();

      const filtered: Terms = terms.filter((t: Term) => {
        return t === Term.DAILY;
      });

      expect(filtered.size()).toBe(1);
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.find = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(Terms.all().terms);
      // @ts-expect-error
      terms.terms = project;

      terms.find(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});

import { MockProject } from '@jamashita/publikum-collection';
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
      const terms: Terms = Terms.of(project);

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
      const terms: Terms = Terms.of(project);

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
      const terms: Terms = Terms.of(project);

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
      const terms: Terms = Terms.of(project);

      terms.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('normal case', () => {
      expect.assertions(1);

      const ids: Array<TermID> = Terms.all().map<TermID>((term: Term) => {
        return term.getTermID();
      });

      expect(ids).toHaveLength(Terms.all().size());
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      expect.assertions(1);

      expect(Terms.all()).toBe(Terms.all());
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.equals = spy;

      // @ts-expect-error
      const terms: Terms = Terms.of(project);

      terms.equals(Terms.all());

      expect(spy.called).toBe(true);
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
      const terms: Terms = Terms.of(project);

      terms.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(2);

      const arr: Array<[TermID, Term]> = [
        [Term.DAILY.getTermID(), Term.DAILY],
        [Term.MONTHLY.getTermID(), Term.MONTHLY]
      ];
      const project: MockProject<TermID, Term> = new MockProject<TermID, Term>(new Map<TermID, Term>(arr));

      // @ts-expect-error
      const terms: Terms = Terms.of(project);

      let i: number = 0;

      for (const pair of terms) {
        expect(pair.getValue()).toBe(arr[i][1]);
        i++;
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
      const terms: Terms = Terms.of(project);

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
      const terms: Terms = Terms.of(project);

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
      const terms: Terms = Terms.of(project);

      terms.values();

      expect(spy.called).toBe(true);
    });
  });
});

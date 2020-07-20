import { MockAProject } from '@jamashita/publikum-collection';
import sinon, { SinonSpy } from 'sinon';
import { TermID } from 'src/VO/Term/TermID';

import { Term } from '../Term';
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
    it('delegates its inner collection instance', async () => {
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.get = spy;

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      terms.get(Term.MONTHLY.getTermID());

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', async () => {
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.contains = spy;

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      terms.contains(Term.MONTHLY);

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', async () => {
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.isEmpty = spy;

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      terms.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', async () => {
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.forEach = spy;

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      terms.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('normal case', async () => {
      const ids: Array<TermID> = Terms.all().map<TermID>((term: Term) => {
        return term.getTermID();
      });

      expect(ids.length).toBe(Terms.all().size());
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      expect(Terms.all()).toBe(Terms.all());
    });

    it('delegates its inner collection instance', async () => {
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.equals = spy;

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      terms.equals(Terms.all());

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', async () => {
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.toString = spy;

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      terms.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', async () => {
      const arr: Array<[TermID, Term]> = [
        [Term.DAILY.getTermID(), Term.DAILY],
        [Term.MONTHLY.getTermID(), Term.MONTHLY]
      ];
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(new Map<TermID, Term>(arr));

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      let i: number = 0;

      for (const pair of terms) {
        expect(pair.getValue()).toBe(arr[i][1]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', async () => {
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.every = spy;

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      terms.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', async () => {
      const project: MockAProject<TermID, Term> = new MockAProject<TermID, Term>(
        new Map<TermID, Term>([
          [Term.DAILY.getTermID(), Term.DAILY],
          [Term.MONTHLY.getTermID(), Term.MONTHLY]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.some = spy;

      // @ts-ignore
      const terms: Terms = Terms.of(project);

      terms.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});

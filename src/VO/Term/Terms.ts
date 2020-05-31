import { Collection, ImmutableProject, Project } from '@jamashita/publikum-collection';
import { Quantum } from '@jamashita/publikum-monad';
import { Objet } from '@jamashita/publikum-object';
import { Mapper } from '@jamashita/publikum-type';

import { Term } from './Term';
import { TermID } from './TermID';

export class Terms extends Objet implements Collection<TermID, Term> {
  public readonly noun: 'Terms' = 'Terms';
  private readonly terms: Project<TermID, Term>;

  private static readonly ALL: Terms = Terms.ofSpread(
    Term.DAILY,
    Term.WEEKLY,
    Term.MONTHLY,
    Term.QUARTERLY,
    Term.ANNUAL
  );

  public static all(): Terms {
    return Terms.ALL;
  }

  private static of(terms: Project<TermID, Term>): Terms {
    return new Terms(terms);
  }

  private static ofMap(terms: Map<TermID, Term>): Terms {
    return Terms.of(ImmutableProject.of<TermID, Term>(terms));
  }

  private static ofArray(terms: Array<Term>): Terms {
    const map: Map<TermID, Term> = new Map<TermID, Term>();

    terms.forEach((term: Term) => {
      map.set(term.getTermID(), term);
    });

    return Terms.ofMap(map);
  }

  private static ofSpread(...terms: Array<Term>): Terms {
    return Terms.ofArray(terms);
  }

  protected constructor(terms: Project<TermID, Term>) {
    super();
    this.terms = terms;
  }

  public get(key: TermID): Quantum<Term> {
    return this.terms.get(key);
  }

  public contains(value: Term): boolean {
    return this.terms.contains(value);
  }

  public size(): number {
    return this.terms.size();
  }

  public isEmpty(): boolean {
    return false;
  }

  public map<U>(mapper: Mapper<Term, U>): Array<U> {
    const array: Array<U> = [];
    let i: number = 0;

    this.terms.forEach((term: Term) => {
      array.push(mapper(term, i));
      i++;
    });

    return array;
  }

  public equals(other: Terms): boolean {
    if (this === other) {
      return true;
    }

    return this.terms.equals(other.terms);
  }

  public serialize(): string {
    return this.terms.toString();
  }
}

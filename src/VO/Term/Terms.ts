import { CancellableEnumerator, ImmutableProject, Pair, Project, Quantity } from '@jamashita/publikum-collection';
import { BinaryPredicate, Mapper, Nullable } from '@jamashita/publikum-type';
import { Term } from './Term';
import { TermID } from './TermID';

export class Terms extends Quantity<Terms, TermID, Term, 'Terms'> {
  public readonly noun: 'Terms' = 'Terms';
  private readonly terms: Project<TermID, Term>;

  private static readonly ALL: Terms = Terms.ofArray([
    Term.DAILY,
    Term.WEEKLY,
    Term.MONTHLY,
    Term.QUARTERLY,
    Term.ANNUAL
  ]);

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

  protected constructor(terms: Project<TermID, Term>) {
    super();
    this.terms = terms;
  }

  public get(key: TermID): Nullable<Term> {
    return this.terms.get(key);
  }

  public contains(value: Term): boolean {
    return this.terms.contains(value);
  }

  public size(): number {
    return this.terms.size();
  }

  public isEmpty(): boolean {
    return this.terms.isEmpty();
  }

  public forEach(iterator: CancellableEnumerator<TermID, Term>): void {
    this.terms.forEach(iterator);
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

  public [Symbol.iterator](): Iterator<Pair<TermID, Term>> {
    return this.terms[Symbol.iterator]();
  }

  public every(predicate: BinaryPredicate<Term, TermID>): boolean {
    return this.terms.every(predicate);
  }

  public some(predicate: BinaryPredicate<Term, TermID>): boolean {
    return this.terms.some(predicate);
  }

  public map<U>(mapper: Mapper<Term, U>): Array<U> {
    const array: Array<U> = [];
    let i: number = 0;

    this.forEach((term: Term) => {
      array.push(mapper(term, i));
      i++;
    });

    return array;
  }
}

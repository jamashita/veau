import { BinaryPredicate, Catalogue, Mapper, Nullable } from '@jamashita/anden-type';
import { ImmutableProject, Quantity, ReadonlyProject } from '@jamashita/lluvia-collection';
import { Term } from './Term';
import { TermID } from './TermID';

export class Terms extends Quantity<TermID, Term, 'Terms'> {
  public readonly noun: 'Terms' = 'Terms';
  private readonly terms: ImmutableProject<TermID, Term>;

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

  private static of(terms: ReadonlyProject<TermID, Term>): Terms {
    return Terms.ofMap(terms.toMap());
  }

  private static ofArray(terms: ReadonlyArray<Term>): Terms {
    const map: Map<TermID, Term> = new Map<TermID, Term>();

    terms.forEach((term: Term) => {
      map.set(term.getTermID(), term);
    });

    return Terms.ofMap(map);
  }

  private static ofMap(terms: ReadonlyMap<TermID, Term>): Terms {
    return new Terms(ImmutableProject.ofMap<TermID, Term>(terms));
  }

  protected constructor(terms: ImmutableProject<TermID, Term>) {
    super();
    this.terms = terms;
  }

  public contains(value: Term): boolean {
    return this.terms.contains(value);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }

  public every(predicate: BinaryPredicate<Term, TermID>): boolean {
    return this.terms.every(predicate);
  }

  public filter(predicate: BinaryPredicate<Term, TermID>): Terms {
    return Terms.of(this.terms.filter(predicate));
  }

  public find(predicate: BinaryPredicate<Term, TermID>): Nullable<Term> {
    return this.terms.find(predicate);
  }

  public forEach(catalogue: Catalogue<TermID, Term>): void {
    this.terms.forEach(catalogue);
  }

  public get(key: TermID): Nullable<Term> {
    return this.terms.get(key);
  }

  public isEmpty(): boolean {
    return this.terms.isEmpty();
  }

  public iterator(): Iterator<[TermID, Term]> {
    return this.terms[Symbol.iterator]();
  }

  public map<U>(mapper: Mapper<Term, U>): ReadonlyProject<TermID, U> {
    return this.terms.map<U>(mapper);
  }

  public serialize(): string {
    return this.terms.toString();
  }

  public size(): number {
    return this.terms.size();
  }

  public some(predicate: BinaryPredicate<Term, TermID>): boolean {
    return this.terms.some(predicate);
  }

  public values(): Iterable<Term> {
    return this.terms.values();
  }
}

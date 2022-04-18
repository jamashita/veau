import { BinaryPredicate, ForEach, Mapping, Nullable } from '@jamashita/anden-type';
import { Quantity } from '@jamashita/lluvia-collection';
import { ImmutableProject, ReadonlyProject } from '@jamashita/lluvia-project';
import { Term } from './Term.js';
import { TermID } from './TermID.js';

export class Terms extends Quantity<TermID, Term> {
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
    const map: Map<TermID, Term> = new Map();

    terms.forEach((term: Term) => {
      map.set(term.getTermID(), term);
    });

    return Terms.ofMap(map);
  }

  private static ofMap(terms: ReadonlyMap<TermID, Term>): Terms {
    return new Terms(ImmutableProject.ofMap(terms));
  }

  protected constructor(terms: ImmutableProject<TermID, Term>) {
    super();
    this.terms = terms;
  }

  public contains(value: Term): boolean {
    return this.terms.contains(value);
  }

  public equals(other: unknown): boolean {
    return this === other;
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

  public forEach(foreach: ForEach<TermID, Term>): void {
    this.terms.forEach(foreach);
  }

  public get(key: TermID): Nullable<Term> {
    return this.terms.get(key);
  }

  public override isEmpty(): boolean {
    return this.terms.isEmpty();
  }

  public iterator(): Iterator<[TermID, Term]> {
    return this.terms.iterator();
  }

  public map<W>(mapping: Mapping<Term, W>): ImmutableProject<TermID, W> {
    return this.terms.map(mapping);
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

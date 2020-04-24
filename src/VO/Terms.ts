import { Collection, ImmutableSequence, Mapper, Objet, Quantum, Sequence } from 'publikum';
import { Term } from './Term';

export class Terms extends Objet implements Collection<number, Term> {
  public readonly noun: 'Terms' = 'Terms';
  private readonly terms: Sequence<Term>;

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

  protected static of(terms: Sequence<Term>): Terms {
    return new Terms(terms);
  }

  protected static ofArray(terms: Array<Term>): Terms {
    return Terms.of(ImmutableSequence.of<Term>(terms));
  }

  protected static ofSpread(...terms: Array<Term>): Terms {
    return Terms.ofArray(terms);
  }

  protected constructor(terms: Sequence<Term>) {
    super();
    this.terms = terms;
  }

  public get(index: number): Quantum<Term> {
    return this.terms.get(index);
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
    return this.terms.toArray().map<U>(mapper);
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

import { ImmutableSequence } from '../General/Collection/ImmutableSequence';
import { Sequence } from '../General/Collection/Interface/Sequence';
import { Collection } from '../General/Interface/Collection';
import { Optional } from '../General/Optional/Optional';
import { Mapper } from '../General/Type/Function';
import { Term } from './Term';

export class Terms implements Collection<number, Term> {
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
    this.terms = terms;
  }

  public get(index: number): Optional<Term> {
    return this.terms.get(index);
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

  public map<U>(mapper: Mapper<Term, U>): Array<U> {
    return this.terms.toArray().map<U>(mapper);
  }

  public equals(other: Terms): boolean {
    if (this === other) {
      return true;
    }

    return this.terms.equals(other.terms);
  }

  public toString(): string {
    return this.terms.toArray().map<string>((term: Term) => {
      return term.toString();
    }).join(', ');
  }
}

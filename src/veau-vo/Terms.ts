import { Collection } from '../veau-general/Collection/Collection';
import { Sequence } from '../veau-general/Collection/Sequence';
import { Optional } from '../veau-general/Optional/Optional';
import { Mapper } from '../veau-general/Type/Function';
import { Term } from './Term';

export class Terms implements Collection<number, Term> {
  public readonly noun: 'Terms' = 'Terms';
  private readonly terms: Sequence<Term>;

  public static all(): Terms {
    return Terms.of(Sequence.of<Term>([
      Term.DAILY,
      Term.WEEKLY,
      Term.MONTHLY,
      Term.QUARTERLY,
      Term.ANNUAL
    ]));
  }

  private static of(terms: Sequence<Term>): Terms {
    return new Terms(terms);
  }

  private constructor(terms: Sequence<Term>) {
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

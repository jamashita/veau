import { Collection } from '../veau-general/Collection';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Mapper } from '../veau-general/Type/Mapper';
import { Term } from './Term';

export class Terms implements Collection<number, Term> {
  public readonly noun: 'Terms' = 'Terms';
  private terms: Array<Term>;

  public static all(): Terms {
    return new Terms([
      Term.DAILY,
      Term.WEEKLY,
      Term.MONTHLY,
      Term.QUARTERLY,
      Term.ANNUAL
    ]);
  }

  private constructor(terms: Array<Term>) {
    this.terms = terms;
  }

  public get(index: number): Optional<Term> {
    const term: Term | undefined = this.terms[index];

    if (term === undefined) {
      return None.of<Term>();
    }

    return Some.of<Term>(term);
  }

  public contains(value: Term): boolean {
    const found: Term | undefined = this.terms.find((term: Term) => {
      if (value === term) {
        return true;
      }

      return false;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  public size(): number {
    return this.terms.length;
  }

  public map<U>(mapper: Mapper<Term, U>): Array<U> {
    return this.terms.map<U>(mapper);
  }

  public isEmpty(): boolean {
    return false;
  }

  public equals(other: Terms): boolean {
    const length: number = this.terms.length;
    if (length !== other.size()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (this.terms[i] !== other.get(i).get()) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return this.terms.map<string>((term: Term) => {
      return term.toString();
    }).join(', ');
  }
}

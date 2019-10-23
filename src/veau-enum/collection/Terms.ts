import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Collection } from '../../veau-general/Collection';
import { Enumerator } from '../../veau-general/Type/Enumerator';
import { Mapper } from '../../veau-general/Type/Mapper';
import { Term } from '../Term';

export class Terms implements Collection<number, Term> {
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

  public get(index: number): Term {
    const term: Term | undefined = this.terms[index];

    if (term === undefined) {
      throw new NoSuchElementError(index.toString());
    }

    return term;
  }

  public contains(value: Term): boolean {
    const found: Term | undefined = this.terms.find((term: Term): boolean => {
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

  public forEach(enumerator: Enumerator<number, Term>): void {
    this.terms.forEach(enumerator);
  }

  public map<U>(mapper: Mapper<Term, U>): Array<U> {
    return this.terms.map<U>(mapper);
  }

  public isEmpty(): boolean {
    return false;
  }

  public equals(other: Terms): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.terms.length;
    if (length !== other.size()) {
      return false;
    }
    for (let i: number = 0; i < length; i++) {
      if (this.terms[i] !== other.get(i)) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return this.terms.map<string>((term: Term): string => {
      return term.toString();
    }).join(' ');
  }
}

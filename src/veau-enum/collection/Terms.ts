import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Term } from '../Term';

export class Terms {
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

  public length(): number {
    return this.terms.length;
  }

  public map<U>(func: (term: Term) => U): Array<U> {
    return this.terms.map<U>(func);
  }

  public equals(other: Terms): boolean {
    if (this === other) {
      return true;
    }

    const length: number = this.terms.length;
    if (length !== other.length()) {
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

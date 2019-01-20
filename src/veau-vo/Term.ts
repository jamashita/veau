import { NoSuchElementError } from '../veau-general/NoSuchElementError';
import { ValueObject } from './ValueObject';

const DAILY: number = 1;
const WEEKLY: number = 2;
const MONTHLY: number = 3;
const ANNUAL: number = 4;

export class Term extends ValueObject {
  private id: number;

  public static DAILY: Term = new Term(DAILY);
  public static WEEKLY: Term = new Term(WEEKLY);
  public static MONTHLY: Term = new Term(MONTHLY);
  public static ANNUAL: Term = new Term(ANNUAL);

  public static of(id: number): Term {
    switch (id) {
      case Term.DAILY.get(): {
        return Term.DAILY;
      }
      case Term.WEEKLY.get(): {
        return Term.WEEKLY;
      }
      case Term.MONTHLY.get(): {
        return Term.MONTHLY;
      }
      case Term.ANNUAL.get(): {
        return Term.ANNUAL;
      }
      default: {
        throw new NoSuchElementError(id.toString());
      }
    }
  }

  private constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public equals(other: Term): boolean {
    if (this === other) {
      return true;
    }
    if (this.id === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.id.toString();
  }
}

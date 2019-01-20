import { NoSuchElementError } from '../veau-general/Error';
import { ValueObject } from './ValueObject';

export class Term extends ValueObject {
  private id: number;

  public static DAILY: Term = new Term(1);
  public static WEEKLY: Term = new Term(2);
  public static MONTHLY: Term = new Term(3);
  public static ANNUAL: Term = new Term(4);

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

import { NoSuchElementError } from '../veau-general/Error';
import { ValueObject } from './ValueObject';

export class Term extends ValueObject {
  private id: number;

  public static DAILY = new Term(1);
  public static WEEKLY = new Term(2);
  public static MONTHLY = new Term(3);
  public static ANNUAL = new Term(4);

  public static of(id: number): Term {
    switch (id) {
      case 1: {
        return Term.DAILY;
      }
      case 2: {
        return Term.WEEKLY;
      }
      case 3: {
        return Term.MONTHLY;
      }
      case 4: {
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

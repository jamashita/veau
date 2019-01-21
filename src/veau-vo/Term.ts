import { NoSuchElementError } from '../veau-general/NoSuchElementError';
import { ValueObject } from './ValueObject';

const DAILY: number = 1;
const WEEKLY: number = 2;
const MONTHLY: number = 3;
const ANNUAL: number = 4;

export class Term extends ValueObject {
  private id: number;
  private key: string;

  public static DAILY: Term = new Term(DAILY, 'DAILY');
  public static WEEKLY: Term = new Term(WEEKLY, 'WEEKLY');
  public static MONTHLY: Term = new Term(MONTHLY, 'MONTHLY');
  public static ANNUAL: Term = new Term(ANNUAL, 'ANNUAL');

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

  private constructor(id: number, key: string) {
    super();
    this.id = id;
    this.key = key;
  }

  public get(): number {
    return this.id;
  }

  public getKey(): string {
    return this.key;
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
    return this.key;
  }
}

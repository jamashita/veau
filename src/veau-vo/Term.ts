import { NoSuchElementError } from '../veau-general/NoSuchElementError';
import { ValueObject } from './ValueObject';

const DAILY: number = 1;
const WEEKLY: number = 2;
const MONTHLY: number = 3;
const QUARTERLY: number = 4;
const ANNUAL: number = 5;

export class Term extends ValueObject {
  private id: number;
  private key: string;

  public static DAILY: Term = new Term(DAILY, 'DAILY');
  public static WEEKLY: Term = new Term(WEEKLY, 'WEEKLY');
  public static MONTHLY: Term = new Term(MONTHLY, 'MONTHLY');
  public static QUARTERLY: Term = new Term(QUARTERLY, 'QUARTERLY');
  public static ANNUAL: Term = new Term(ANNUAL, 'ANNUAL');

  public static of(id: number): Term {
    switch (id) {
      case DAILY: {
        return Term.DAILY;
      }
      case WEEKLY: {
        return Term.WEEKLY;
      }
      case MONTHLY: {
        return Term.MONTHLY;
      }
      case QUARTERLY: {
        return Term.QUARTERLY;
      }
      case ANNUAL: {
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

  public copy(): Term {
    const {
      id,
      key
    } = this;

    return new Term(id, key);
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

import { TermError } from '../veau-error/TermError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ValueObject } from '../veau-general/ValueObject';

const DAILY_ID: number = 1;
const WEEKLY_ID: number = 2;
const MONTHLY_ID: number = 3;
const QUARTERLY_ID: number = 4;
const ANNUAL_ID: number = 5;

export class Term extends ValueObject {
  public readonly noun: 'Term' = 'Term';
  private readonly id: number;
  private readonly key: string;

  public static DAILY: Term = new Term(DAILY_ID, 'DAILY');
  public static WEEKLY: Term = new Term(WEEKLY_ID, 'WEEKLY');
  public static MONTHLY: Term = new Term(MONTHLY_ID, 'MONTHLY');
  public static QUARTERLY: Term = new Term(QUARTERLY_ID, 'QUARTERLY');
  public static ANNUAL: Term = new Term(ANNUAL_ID, 'ANNUAL');

  public static of(id: number): Try<Term, TermError> {
    switch (id) {
      case DAILY_ID: {
        return Success.of<Term, TermError>(Term.DAILY);
      }
      case WEEKLY_ID: {
        return Success.of<Term, TermError>(Term.WEEKLY);
      }
      case MONTHLY_ID: {
        return Success.of<Term, TermError>(Term.MONTHLY);
      }
      case QUARTERLY_ID: {
        return Success.of<Term, TermError>(Term.QUARTERLY);
      }
      case ANNUAL_ID: {
        return Success.of<Term, TermError>(Term.ANNUAL);
      }
      default: {
        return Failure.of<Term, TermError>(new TermError(id.toString()));
      }
    }
  }

  private constructor(id: number, key: string) {
    super();
    this.id = id;
    this.key = key;
  }

  public getID(): number {
    return this.id;
  }

  public getKey(): string {
    return this.key;
  }

  public equals(other: Term): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.key;
  }
}

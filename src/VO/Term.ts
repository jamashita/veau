import { ValueObject } from 'publikum';
import { TermError } from '../Error/TermError';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';

const DAILY_ID: number = 1;
const WEEKLY_ID: number = 2;
const MONTHLY_ID: number = 3;
const QUARTERLY_ID: number = 4;
const ANNUAL_ID: number = 5;

export class Term extends ValueObject {
  public readonly noun: 'Term' = 'Term';
  private readonly id: number;
  private readonly key: string;

  public static readonly DAILY: Term = new Term(DAILY_ID, 'DAILY');
  public static readonly WEEKLY: Term = new Term(WEEKLY_ID, 'WEEKLY');
  public static readonly MONTHLY: Term = new Term(MONTHLY_ID, 'MONTHLY');
  public static readonly QUARTERLY: Term = new Term(QUARTERLY_ID, 'QUARTERLY');
  public static readonly ANNUAL: Term = new Term(ANNUAL_ID, 'ANNUAL');

  public static of(id: number): Superposition<Term, TermError> {
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
        return Failure.of<Term, TermError>(new TermError(`${id}`));
      }
    }
  }

  protected constructor(id: number, key: string) {
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

  public serialize(): string {
    return this.key;
  }
}

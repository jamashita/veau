import { RuntimeError } from '../veau-error/RuntimeError';

const DAILY_ID: number = 1;
const WEEKLY_ID: number = 2;
const MONTHLY_ID: number = 3;
const QUARTERLY_ID: number = 4;
const ANNUAL_ID: number = 5;

export class Term {
  private id: number;
  private key: string;

  public static DAILY: Term = new Term(DAILY_ID, 'DAILY');
  public static WEEKLY: Term = new Term(WEEKLY_ID, 'WEEKLY');
  public static MONTHLY: Term = new Term(MONTHLY_ID, 'MONTHLY');
  public static QUARTERLY: Term = new Term(QUARTERLY_ID, 'QUARTERLY');
  public static ANNUAL: Term = new Term(ANNUAL_ID, 'ANNUAL');

  public static of(id: number): Term {
    switch (id) {
      case DAILY_ID: {
        return Term.DAILY;
      }
      case WEEKLY_ID: {
        return Term.WEEKLY;
      }
      case MONTHLY_ID: {
        return Term.MONTHLY;
      }
      case QUARTERLY_ID: {
        return Term.QUARTERLY;
      }
      case ANNUAL_ID: {
        return Term.ANNUAL;
      }
      default: {
        throw new RuntimeError(id.toString());
      }
    }
  }

  public static all(): Array<Term> {
    return [
      Term.DAILY,
      Term.WEEKLY,
      Term.MONTHLY,
      Term.QUARTERLY,
      Term.ANNUAL
    ];
  }

  private constructor(id: number, key: string) {
    this.id = id;
    this.key = key;
  }

  public getID(): number {
    return this.id;
  }

  public getKey(): string {
    return this.key;
  }

  public toString(): string {
    return this.key;
  }
}

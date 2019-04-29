import { NoSuchElementError } from '../veau-error/NoSuchElementError';

export class Term {
  private id: number;
  private key: string;

  private static DAILY_ID: number = 1;
  private static WEEKLY_ID: number = 2;
  private static MONTHLY_ID: number = 3;
  private static QUARTERLY_ID: number = 4;
  private static ANNUAL_ID: number = 5;

  public static DAILY: Term = new Term(Term.DAILY_ID, 'DAILY');
  public static WEEKLY: Term = new Term(Term.WEEKLY_ID, 'WEEKLY');
  public static MONTHLY: Term = new Term(Term.MONTHLY_ID, 'MONTHLY');
  public static QUARTERLY: Term = new Term(Term.QUARTERLY_ID, 'QUARTERLY');
  public static ANNUAL: Term = new Term(Term.ANNUAL_ID, 'ANNUAL');

  public static of(id: number): Term {
    switch (id) {
      case Term.DAILY_ID: {
        return Term.DAILY;
      }
      case Term.WEEKLY_ID: {
        return Term.WEEKLY;
      }
      case Term.MONTHLY_ID: {
        return Term.MONTHLY;
      }
      case Term.QUARTERLY_ID: {
        return Term.QUARTERLY;
      }
      case Term.ANNUAL_ID: {
        return Term.ANNUAL;
      }
      default: {
        throw new NoSuchElementError(id.toString());
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

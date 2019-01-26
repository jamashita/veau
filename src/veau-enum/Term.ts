import { NoSuchElementError } from '../veau-general/NoSuchElementError';

const DAILY: number = 1;
const WEEKLY: number = 2;
const MONTHLY: number = 3;
const QUARTERLY: number = 4;
const ANNUAL: number = 5;

export class Term {
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

  public get(): number {
    return this.id;
  }

  public getKey(): string {
    return this.key;
  }

  public toString(): string {
    return this.key;
  }
}

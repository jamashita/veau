import { ValueObject } from '@jamashita/anden-object';
import { Zeit, ZeitError } from '@jamashita/anden-zeit';
import { Term } from '../Term/Term';
import { AsOfError } from './error/AsOfError';

const TERM_FORMAT: string = 'YYYY-MM-DD';

export class AsOf extends ValueObject<'AsOf'> {
  public readonly noun: 'AsOf' = 'AsOf';
  private readonly asOf: Zeit;

  public static format(): string {
    return TERM_FORMAT;
  }

  public static now(): AsOf {
    return AsOf.of(Zeit.now(TERM_FORMAT));
  }

  public static of(asOf: Zeit): AsOf {
    return new AsOf(asOf);
  }

  public static ofString(asOf: string): AsOf {
    try {
      const zeit: Zeit = Zeit.ofString(asOf, TERM_FORMAT);

      return AsOf.of(zeit);
    }
    catch (err: unknown) {
      if (err instanceof ZeitError) {
        throw new AsOfError('asOf is not suitable for date time', err);
      }

      throw err;
    }
  }

  protected constructor(asOf: Zeit) {
    super();
    this.asOf = asOf;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof AsOf)) {
      return false;
    }

    return this.asOf.equals(other.asOf);
  }

  public serialize(): string {
    return this.asOf.toString();
  }

  public get(): Zeit {
    return this.asOf;
  }

  public isAfter(other: AsOf): boolean {
    return this.asOf.isAfter(other.asOf);
  }

  public isBefore(other: AsOf): boolean {
    return this.asOf.isBefore(other.asOf);
  }

  public next(term: Term): AsOf {
    switch (term) {
      case Term.DAILY: {
        return AsOf.of(this.asOf.future(1, 'day'));
      }
      case Term.WEEKLY: {
        return AsOf.of(this.asOf.future(1, 'week'));
      }
      case Term.MONTHLY: {
        return AsOf.of(this.asOf.future(1, 'month'));
      }
      case Term.QUARTERLY: {
        return AsOf.of(this.asOf.future(3, 'month'));
      }
      case Term.ANNUAL: {
        return AsOf.of(this.asOf.future(1, 'year'));
      }
      default: {
        throw new AsOfError(`UNEXPECTED VALUE: ${term.getTermID().get().get()}`);
      }
    }
  }

  public previous(term: Term): AsOf {
    switch (term) {
      case Term.DAILY: {
        return AsOf.of(this.asOf.past(1, 'day'));
      }
      case Term.WEEKLY: {
        return AsOf.of(this.asOf.past(1, 'week'));
      }
      case Term.MONTHLY: {
        return AsOf.of(this.asOf.past(1, 'month'));
      }
      case Term.QUARTERLY: {
        return AsOf.of(this.asOf.past(3, 'month'));
      }
      case Term.ANNUAL: {
        return AsOf.of(this.asOf.past(1, 'year'));
      }
      default: {
        throw new AsOfError(`UNEXPECTED VALUE: ${term.getTermID().get().get()}`);
      }
    }
  }
}

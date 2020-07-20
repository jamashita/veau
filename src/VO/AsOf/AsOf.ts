import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Zeit, ZeitError } from '@jamashita/publikum-zeit';

import { Term } from '../Term/Term';
import { AsOfError } from './Error/AsOfError';

const TERM_FORMAT: string = 'YYYY-MM-DD';

export class AsOf extends ValueObject<AsOf, 'AsOf'> {
  public readonly noun: 'AsOf' = 'AsOf';
  private readonly asOf: Zeit;

  public static of(asOf: Zeit): AsOf {
    return new AsOf(asOf);
  }

  public static ofString(asOf: string): Superposition<AsOf, AsOfError> {
    return Superposition.playground<Zeit, ZeitError>(() => {
      return Zeit.ofString(asOf, TERM_FORMAT);
    }, ZeitError).transform<AsOf, AsOfError>(
      (zeit: Zeit) => {
        return AsOf.of(zeit);
      },
      (err: ZeitError) => {
        throw new AsOfError('asOf is not suitable for date time', err);
      },
      AsOfError
    );
  }

  public static now(): AsOf {
    return AsOf.of(Zeit.now(TERM_FORMAT));
  }

  public static format(): string {
    return TERM_FORMAT;
  }

  protected constructor(asOf: Zeit) {
    super();
    this.asOf = asOf;
  }

  public equals(other: AsOf): boolean {
    if (this === other) {
      return true;
    }

    return this.asOf.equals(other.asOf);
  }

  public serialize(): string {
    return this.asOf.toString();
  }

  public get(): Zeit {
    return this.asOf;
  }

  public isBefore(other: AsOf): boolean {
    return this.asOf.isBefore(other.asOf);
  }

  public isAfter(other: AsOf): boolean {
    return this.asOf.isAfter(other.asOf);
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
}

import moment from 'moment';
import { Term } from '../veau-enum/Term';
import { RuntimeError } from '../veau-general/RuntimeError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

const TERM_FORMAT: string = 'YYYY-MM-DD';

export class AsOf extends ValueObject {
  private asOf: moment.Moment;

  public static of(asOf: moment.Moment): AsOf {
    return new AsOf(asOf);
  }

  public static ofString(asOf: string): AsOf {
    if (Type.isDateString(asOf)) {
      return AsOf.of(moment(asOf));
    }

    throw new RuntimeError('asOf is not suitable for date time');
  }

  private constructor(asOf: moment.Moment) {
    super();
    this.asOf = asOf;
  }

  public get(): moment.Moment {
    return moment(this.asOf);
  }

  public getString(): string {
    return this.asOf.format(TERM_FORMAT);
  }

  public isBefore(other: AsOf): boolean {
    if (this.asOf.isBefore(other.get())) {
      return true;
    }

    return false;
  }

  public isAfter(other: AsOf): boolean {
    if (this.asOf.isAfter(other.get())) {
      return true;
    }

    return false;
  }

  public previous(term: Term): AsOf {
    const asOf: moment.Moment = moment(this.asOf);

    switch (term) {
      case Term.DAILY: {
        return AsOf.of(asOf.subtract(1, 'days'));
      }
      case Term.WEEKLY: {
        return AsOf.of(asOf.subtract(1, 'weeks'));
      }
      case Term.MONTHLY: {
        return AsOf.of(asOf.subtract(1, 'months'));
      }
      case Term.QUARTERLY: {
        return AsOf.of(asOf.subtract(1, 'quarters'));
      }
      case Term.ANNUAL: {
        return AsOf.of(asOf.subtract(1, 'years'));
      }
      default: {
        throw new RuntimeError(`UNEXPECTED VALUE: ${term.getID()}`);
      }
    }
  }

  public next(term: Term): AsOf {
    const asOf: moment.Moment = moment(this.asOf);

    switch (term) {
      case Term.DAILY: {
        return AsOf.of(asOf.add(1, 'days'));
      }
      case Term.WEEKLY: {
        return AsOf.of(asOf.add(1, 'weeks'));
      }
      case Term.MONTHLY: {
        return AsOf.of(asOf.add(1, 'months'));
      }
      case Term.QUARTERLY: {
        return AsOf.of(asOf.add(1, 'quarters'));
      }
      case Term.ANNUAL: {
        return AsOf.of(asOf.add(1, 'years'));
      }
      default: {
        throw new RuntimeError(`UNEXPECTED VALUE: ${term.getID()}`);
      }
    }
  }

  public equals(other: AsOf): boolean {
    if (this === other) {
      return true;
    }
    if (this.asOf.isSame(other.get())) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.getString();
  }
}
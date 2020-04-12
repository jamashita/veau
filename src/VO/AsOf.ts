import moment from 'moment';
import { AsOfError } from '../Error/AsOfError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { ValueObject } from '../General/ValueObject';
import { Term } from './Term';

const TERM_FORMAT: string = 'YYYY-MM-DD';

export class AsOf extends ValueObject {
  public readonly noun: 'AsOf' = 'AsOf';
  private readonly asOf: moment.Moment;

  public static of(asOf: moment.Moment): AsOf {
    return new AsOf(asOf);
  }

  public static ofString(asOf: string): Try<AsOf, AsOfError> {
    const date: moment.Moment = moment.utc(asOf, TERM_FORMAT, true);

    if (date.isValid()) {
      return Success.of<AsOf, AsOfError>(AsOf.of(date));
    }

    return Failure.of<AsOf, AsOfError>(new AsOfError('asOf is not suitable for date time'));
  }

  protected constructor(asOf: moment.Moment) {
    super();
    this.asOf = asOf;
  }

  public get(): moment.Moment {
    return moment(this.asOf);
  }

  public isBefore(other: AsOf): boolean {
    if (this.asOf.isBefore(other.asOf)) {
      return true;
    }

    return false;
  }

  public isAfter(other: AsOf): boolean {
    if (this.asOf.isAfter(other.asOf)) {
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
        throw new AsOfError(`UNEXPECTED VALUE: ${term.getID()}`);
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
        throw new AsOfError(`UNEXPECTED VALUE: ${term.getID()}`);
      }
    }
  }

  public equals(other: AsOf): boolean {
    if (this === other) {
      return true;
    }
    if (this.asOf.isSame(other.asOf)) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.asOf.format(TERM_FORMAT);
  }
}

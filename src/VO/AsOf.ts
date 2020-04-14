import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import utc from 'dayjs/plugin/utc';
import { AsOfError } from '../Error/AsOfError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { ValueObject } from '../General/ValueObject';
import { Term } from './Term';

dayjs.extend(utc);
dayjs.extend(minMax);

const TERM_FORMAT: string = 'YYYY-MM-DD';

export class AsOf extends ValueObject {
  public readonly noun: 'AsOf' = 'AsOf';
  private readonly asOf: dayjs.Dayjs;

  public static of(asOf: dayjs.Dayjs): AsOf {
    return new AsOf(asOf);
  }

  public static ofString(asOf: string): Try<AsOf, AsOfError> {
    const date: dayjs.Dayjs = dayjs.utc(asOf, TERM_FORMAT);

    if (date.isValid()) {
      return Success.of<AsOf, AsOfError>(AsOf.of(date));
    }

    return Failure.of<AsOf, AsOfError>(new AsOfError('asOf is not suitable for date time'));
  }

  protected constructor(asOf: dayjs.Dayjs) {
    super();
    this.asOf = asOf;
  }

  public get(): dayjs.Dayjs {
    return this.asOf;
  }

  public isBefore(other: AsOf): boolean {
    return this.asOf.isBefore(other.asOf);
  }

  public isAfter(other: AsOf): boolean {
    return this.asOf.isAfter(other.asOf);
  }

  public previous(term: Term): AsOf {
    const asOf: dayjs.Dayjs = this.get();

    switch (term) {
      case Term.DAILY: {
        return AsOf.of(asOf.subtract(1, 'day'));
      }
      case Term.WEEKLY: {
        return AsOf.of(asOf.subtract(1, 'week'));
      }
      case Term.MONTHLY: {
        return AsOf.of(asOf.subtract(1, 'month'));
      }
      case Term.QUARTERLY: {
        return AsOf.of(asOf.subtract(3, 'month'));
      }
      case Term.ANNUAL: {
        return AsOf.of(asOf.subtract(1, 'year'));
      }
      default: {
        throw new AsOfError(`UNEXPECTED VALUE: ${term.getID()}`);
      }
    }
  }

  public next(term: Term): AsOf {
    const asOf: dayjs.Dayjs = this.get();

    switch (term) {
      case Term.DAILY: {
        return AsOf.of(asOf.add(1, 'day'));
      }
      case Term.WEEKLY: {
        return AsOf.of(asOf.add(1, 'week'));
      }
      case Term.MONTHLY: {
        return AsOf.of(asOf.add(1, 'month'));
      }
      case Term.QUARTERLY: {
        return AsOf.of(asOf.add(3, 'month'));
      }
      case Term.ANNUAL: {
        return AsOf.of(asOf.add(1, 'year'));
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

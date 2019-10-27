import moment from 'moment';
import { RuntimeError } from '../veau-general/RuntimeError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from './ValueObject';

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

    throw new RuntimeError(`asOf is not suitable for date time`);
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

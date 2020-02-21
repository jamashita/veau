import moment from 'moment';
import { UpdatedAtError } from '../veau-error/UpdatedAtError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';

const TERM_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class UpdatedAt extends ValueObject {
  private at: moment.Moment;

  public static of(at: moment.Moment): UpdatedAt {
    return new UpdatedAt(at);
  }

  public static ofString(at: string): UpdatedAt {
    if (!Type.isDateString(at)) {
      throw new UpdatedAtError('AT IS NOT DATE FORMAT');
    }

    return UpdatedAt.of(moment.utc(at));
  }

  public static now(): UpdatedAt {
    return UpdatedAt.of(moment.utc());
  }

  private constructor(at: moment.Moment) {
    super();
    this.at = at;
  }

  public get(): moment.Moment {
    return moment(this.at);
  }

  public equals(other: UpdatedAt): boolean {
    if (this === other) {
      return true;
    }
    if (this.at.isSame(other.get())) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.at.format(TERM_FORMAT);
  }
}

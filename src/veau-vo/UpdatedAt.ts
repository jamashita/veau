import moment from 'moment';
import {UpdatedAtError} from '../veau-error/UpdatedAtError';
import {Failure} from '../veau-general/Try/Failure';
import {Success} from '../veau-general/Try/Success';
import {Try} from '../veau-general/Try/Try';
import {ValueObject} from '../veau-general/ValueObject';

const TERM_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class UpdatedAt extends ValueObject {
  public readonly noun: 'UpdatedAt' = 'UpdatedAt';
  private readonly at: moment.Moment;

  public static of(at: moment.Moment): UpdatedAt {
    return new UpdatedAt(at);
  }

  public static ofString(at: string): Try<UpdatedAt, UpdatedAtError> {
    const date: moment.Moment = moment.utc(at, TERM_FORMAT, true);

    if (date.isValid()) {
      return Success.of<UpdatedAt, UpdatedAtError>(UpdatedAt.of(date));
    }

    return Failure.of<UpdatedAt, UpdatedAtError>(new UpdatedAtError('AT IS NOT DATE FORMAT'));
  }

  public static now(): UpdatedAt {
    return UpdatedAt.of(moment.utc());
  }

  protected constructor(at: moment.Moment) {
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
    if (this.at.isSame(other.at)) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.at.format(TERM_FORMAT);
  }
}

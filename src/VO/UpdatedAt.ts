import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { UpdatedAtError } from '../Error/UpdatedAtError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { ValueObject } from '../General/ValueObject';

dayjs.extend(utc);

const TERM_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class UpdatedAt extends ValueObject {
  public readonly noun: 'UpdatedAt' = 'UpdatedAt';
  private readonly at: dayjs.Dayjs;

  public static of(at: dayjs.Dayjs): UpdatedAt {
    return new UpdatedAt(at);
  }

  public static ofString(at: string): Try<UpdatedAt, UpdatedAtError> {
    const date: dayjs.Dayjs = dayjs(at, {
      format: TERM_FORMAT,
      utc: true
    });

    if (date.isValid()) {
      return Success.of<UpdatedAt, UpdatedAtError>(UpdatedAt.of(date));
    }

    return Failure.of<UpdatedAt, UpdatedAtError>(new UpdatedAtError('AT IS NOT DATE FORMAT'));
  }

  public static now(): UpdatedAt {
    return UpdatedAt.of(dayjs.utc());
  }

  protected constructor(at: dayjs.Dayjs) {
    super();
    this.at = at;
  }

  public get(): dayjs.Dayjs {
    return this.at;
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

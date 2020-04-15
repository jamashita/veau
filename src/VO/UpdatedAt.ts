import { UpdatedAtError } from '../Error/UpdatedAtError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { ValueObject } from '../General/ValueObject';
import { Zeit } from '../General/Zeit/Zeit';
import { ZeitError } from '../General/Zeit/ZeitError';

const TERM_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class UpdatedAt extends ValueObject {
  public readonly noun: 'UpdatedAt' = 'UpdatedAt';
  private readonly at: Zeit;

  public static of(at: Zeit): UpdatedAt {
    return new UpdatedAt(at);
  }

  public static ofString(at: string): Try<UpdatedAt, UpdatedAtError> {
    try {
      const zeit: Zeit = Zeit.ofString(at, TERM_FORMAT);

      return Success.of<UpdatedAt, UpdatedAtError>(UpdatedAt.of(zeit));
    }
    catch (err) {
      if (err instanceof ZeitError) {
        return Failure.of<UpdatedAt, UpdatedAtError>(new UpdatedAtError('AT IS NOT DATE FORMAT', err));
      }

      throw err;
    }
  }

  public static now(): UpdatedAt {
    return UpdatedAt.of(Zeit.now(TERM_FORMAT));
  }

  public static format(): string {
    return TERM_FORMAT;
  }

  protected constructor(at: Zeit) {
    super();
    this.at = at;
  }

  public get(): Zeit {
    return this.at;
  }

  public equals(other: UpdatedAt): boolean {
    if (this === other) {
      return true;
    }
    if (this.at.equals(other.at)) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.at.toString();
  }
}

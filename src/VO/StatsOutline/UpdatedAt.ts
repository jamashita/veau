import { Alive, Dead, Schrodinger, Superposition, ValueObject, Zeit, ZeitError } from 'publikum';

import { UpdatedAtError } from './Error/UpdatedAtError';

const TERM_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class UpdatedAt extends ValueObject {
  public readonly noun: 'UpdatedAt' = 'UpdatedAt';
  private readonly at: Zeit;

  public static of(at: Zeit): UpdatedAt {
    return new UpdatedAt(at);
  }

  public static ofString(at: string): Superposition<UpdatedAt, UpdatedAtError> {
    return Schrodinger.playground<Zeit, ZeitError>(() => {
      return Zeit.ofString(at, TERM_FORMAT);
    }).match<UpdatedAt, UpdatedAtError>(
      (zeit: Zeit) => {
        return Alive.of<UpdatedAt, UpdatedAtError>(UpdatedAt.of(zeit));
      },
      (err: ZeitError) => {
        return Dead.of<UpdatedAt, UpdatedAtError>(new UpdatedAtError('AT IS NOT DATE FORMAT', err));
      }
    );
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

    return this.at.equals(other.at);
  }

  public serialize(): string {
    return this.at.toString();
  }
}

import { ValueObject } from '@jamashita/anden-object';
import { Zeit, ZeitError } from '@jamashita/anden-zeit';
import { StatsError } from './StatsError.js';

const TERM_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class UpdatedAt extends ValueObject {
  private readonly at: Zeit;

  public static format(): string {
    return TERM_FORMAT;
  }

  public static now(): UpdatedAt {
    return UpdatedAt.of(Zeit.now(TERM_FORMAT));
  }

  public static of(at: Zeit): UpdatedAt {
    return new UpdatedAt(at);
  }

  public static ofString(at: string): UpdatedAt {
    try {
      return UpdatedAt.of(Zeit.ofString(at, TERM_FORMAT));
    }
    catch (err: unknown) {
      if (err instanceof ZeitError) {
        throw new StatsError('AT IS NOT DATE FORMAT', err);
      }

      throw err;
    }
  }

  protected constructor(at: Zeit) {
    super();
    this.at = at;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof UpdatedAt)) {
      return false;
    }

    return this.at.equals(other.at);
  }

  public serialize(): string {
    return this.at.toString();
  }

  public get(): Zeit {
    return this.at;
  }
}

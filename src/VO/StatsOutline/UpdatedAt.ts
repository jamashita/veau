import { ValueObject } from '@jamashita/publikum-object';
import { Zeit, ZeitError } from '@jamashita/publikum-zeit';
import { StatsError } from './Error/StatsError';

const TERM_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class UpdatedAt extends ValueObject<UpdatedAt, 'UpdatedAt'> {
  public readonly noun: 'UpdatedAt' = 'UpdatedAt';
  private readonly at: Zeit;

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

  public equals(other: UpdatedAt): boolean {
    if (this === other) {
      return true;
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

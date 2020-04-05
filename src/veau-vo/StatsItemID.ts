import { StatsItemIDError } from '../veau-error/StatsItemIDError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { UUID } from '../veau-general/UUID';
import { ValueObject } from '../veau-general/ValueObject';

export class StatsItemID extends ValueObject {
  public readonly noun: 'StatsItemID' = 'StatsItemID';
  private id: string;

  public static of(id: string): Try<StatsItemID, StatsItemIDError> {
    if (id.length === UUID.size()) {
      return Success.of<StatsItemID, StatsItemIDError>(new StatsItemID(id));
    }

    return Failure.of<StatsItemID, StatsItemIDError>(new StatsItemIDError(`StatsItemID requires ${UUID.size().toString()} LENGTH`));
  }

  public static generate(): StatsItemID {
    return new StatsItemID(UUID.v4());
  }

  private constructor(id: string) {
    super();
    this.id = id;
  }

  public get(): string {
    return this.id;
  }

  public equals(other: StatsItemID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.id;
  }
}

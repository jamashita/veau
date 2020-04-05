import { StatsIDError } from '../veau-error/StatsIDError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { UUID } from '../veau-general/UUID';
import { ValueObject } from '../veau-general/ValueObject';

export class StatsID extends ValueObject {
  public readonly noun: 'StatsID' = 'StatsID';
  private id: string;

  public static of(id: string): Try<StatsID, StatsIDError> {
    if (id.length === UUID.size()) {
      return Success.of<StatsID, StatsIDError>(new StatsID(id));
    }

    return Failure.of<StatsID, StatsIDError>(new StatsIDError(`StatsID requires ${UUID.size().toString()} LENGTH`));
  }

  public static generate(): StatsID {
    return new StatsID(UUID.v4());
  }

  private constructor(id: string) {
    super();
    this.id = id;
  }

  public get(): string {
    return this.id;
  }

  public equals(other: StatsID): boolean {
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

import { StatsIDError } from '../veau-error/StatsIDError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { UUID } from '../veau-general/UUID/UUID';
import { UUIDError } from '../veau-general/UUID/UUIDError';
import { ValueObject } from '../veau-general/ValueObject';

export class StatsID extends ValueObject {
  public readonly noun: 'StatsID' = 'StatsID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsID {
    return new StatsID(uuid);
  }

  public static ofString(id: string): Try<StatsID, StatsIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Success.of<StatsID, StatsIDError>(new StatsID(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Failure.of<StatsID, StatsIDError>(new StatsIDError(err));
      }

      throw err;
    }
  }

  public static generate(): StatsID {
    return new StatsID(UUID.v4());
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public get(): UUID {
    return this.uuid;
  }

  public equals(other: StatsID): boolean {
    if (this === other) {
      return true;
    }
    if (this.uuid.equals(other.uuid)) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.uuid.toString();
  }
}

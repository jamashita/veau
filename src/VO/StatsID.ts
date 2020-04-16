import { StatsIDError } from '../Error/StatsIDError';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Try } from '../General/Superposition/Try';
import { UUID } from '../General/UUID/UUID';
import { UUIDError } from '../General/UUID/UUIDError';
import { ValueObject } from '../General/ValueObject';

export class StatsID extends ValueObject {
  public readonly noun: 'StatsID' = 'StatsID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsID {
    return new StatsID(uuid);
  }

  public static ofString(id: string): Try<StatsID, StatsIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Success.of<StatsID, StatsIDError>(StatsID.of(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Failure.of<StatsID, StatsIDError>(new StatsIDError('StatsID.ofString()', err));
      }

      throw err;
    }
  }

  public static generate(): StatsID {
    return StatsID.of(UUID.v4());
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

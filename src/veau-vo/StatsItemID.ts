import { StatsItemIDError } from '../veau-error/StatsItemIDError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { UUID } from '../veau-general/UUID/UUID';
import { UUIDError } from '../veau-general/UUID/UUIDError';
import { ValueObject } from '../veau-general/ValueObject';

export class StatsItemID extends ValueObject {
  public readonly noun: 'StatsItemID' = 'StatsItemID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsItemID {
    return new StatsItemID(uuid);
  }

  public static ofString(id: string): Try<StatsItemID, StatsItemIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Success.of<StatsItemID, StatsItemIDError>(new StatsItemID(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Failure.of<StatsItemID, StatsItemIDError>(new StatsItemIDError(err));
      }

      throw err;
    }
  }

  public static generate(): StatsItemID {
    return new StatsItemID(UUID.v4());
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public get(): UUID {
    return this.uuid;
  }

  public equals(other: StatsItemID): boolean {
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

import { StatsItemIDError } from '../Error/StatsItemIDError';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Try } from '../General/Superposition/Try';
import { UUID } from '../General/UUID/UUID';
import { UUIDError } from '../General/UUID/UUIDError';
import { ValueObject } from '../General/ValueObject';

export class StatsItemID extends ValueObject {
  public readonly noun: 'StatsItemID' = 'StatsItemID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsItemID {
    return new StatsItemID(uuid);
  }

  public static ofString(id: string): Try<StatsItemID, StatsItemIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Success.of<StatsItemID, StatsItemIDError>(StatsItemID.of(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Failure.of<StatsItemID, StatsItemIDError>(new StatsItemIDError('StatsItemID.ofString()', err));
      }

      throw err;
    }
  }

  public static generate(): StatsItemID {
    return StatsItemID.of(UUID.v4());
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

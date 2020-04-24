import { Alive, Dead, Superposition, UUID, UUIDError, ValueObject } from 'publikum';
import { StatsIDError } from '../Error/StatsIDError';

export class StatsID extends ValueObject {
  public readonly noun: 'StatsID' = 'StatsID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsID {
    return new StatsID(uuid);
  }

  public static ofString(id: string): Superposition<StatsID, StatsIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Alive.of<StatsID, StatsIDError>(StatsID.of(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Dead.of<StatsID, StatsIDError>(
          new StatsIDError('StatsID.ofString()', err)
        );
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

    return this.uuid.equals(other.uuid);
  }

  public serialize(): string {
    return this.uuid.toString();
  }
}

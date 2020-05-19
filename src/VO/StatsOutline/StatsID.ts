import { Alive, Dead, Schrodinger, Superposition, UUID, UUIDError, ValueObject } from 'publikum';
import { StatsIDError } from './Error/StatsIDError';

export class StatsID extends ValueObject {
  public readonly noun: 'StatsID' = 'StatsID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsID {
    return new StatsID(uuid);
  }

  public static ofString(id: string): Superposition<StatsID, StatsIDError> {
    return Schrodinger.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }).match<StatsID, StatsIDError>(
      (uuid: UUID) => {
        return Alive.of<StatsID, StatsIDError>(StatsID.of(uuid));
      },
      (err: UUIDError) => {
        return Dead.of<StatsID, StatsIDError>(new StatsIDError('StatsID.ofString()', err));
      }
    );
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

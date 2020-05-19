import { Alive, Dead, Schrodinger, Superposition, UUID, UUIDError, ValueObject } from 'publikum';

import { StatsItemIDError } from './Error/StatsItemIDError';

export class StatsItemID extends ValueObject {
  public readonly noun: 'StatsItemID' = 'StatsItemID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsItemID {
    return new StatsItemID(uuid);
  }

  public static ofString(id: string): Superposition<StatsItemID, StatsItemIDError> {
    return Schrodinger.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }).match(
      (uuid: UUID) => {
        return Alive.of<StatsItemID, StatsItemIDError>(StatsItemID.of(uuid));
      },
      (err: UUIDError) => {
        return Dead.of<StatsItemID, StatsItemIDError>(new StatsItemIDError('StatsItemID.ofString()', err));
      }
    );
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

    return this.uuid.equals(other.uuid);
  }

  public serialize(): string {
    return this.uuid.toString();
  }
}

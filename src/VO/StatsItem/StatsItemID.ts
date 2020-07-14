import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';

import { StatsItemIDError } from './Error/StatsItemIDError';

export class StatsItemID extends ValueObject<StatsItemID, 'StatsItemID'> {
  public readonly noun: 'StatsItemID' = 'StatsItemID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsItemID {
    return new StatsItemID(uuid);
  }

  public static ofString(id: string): Superposition<StatsItemID, StatsItemIDError> {
    return Superposition.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }, UUIDError).transform<StatsItemID, StatsItemIDError>(
      (uuid: UUID) => {
        return StatsItemID.of(uuid);
      },
      (err: UUIDError) => {
        throw new StatsItemIDError('StatsItemID.ofString()', err);
      },
      StatsItemIDError
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

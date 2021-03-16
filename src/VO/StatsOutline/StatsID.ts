import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';
import { StatsError } from './Error/StatsError';

export class StatsID extends ValueObject<StatsID, 'StatsID'> {
  public readonly noun: 'StatsID' = 'StatsID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): StatsID {
    return new StatsID(uuid);
  }

  public static ofString(id: string): StatsID {
    try {
      return StatsID.of(UUID.of(id));
    }
    catch (err: unknown) {
      if (err instanceof UUIDError) {
        throw new StatsError('StatsID.ofString()', err);
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

  public equals(other: StatsID): boolean {
    if (this === other) {
      return true;
    }

    return this.uuid.equals(other.uuid);
  }

  public serialize(): string {
    return this.uuid.toString();
  }

  public get(): UUID {
    return this.uuid;
  }
}

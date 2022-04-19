import { ValueObject } from '@jamashita/anden-object';
import { UUID, UUIDError } from '@jamashita/anden-uuid';
import { StatsError } from './StatsError.js';

export class StatsID extends ValueObject {
  private readonly uuid: UUID;

  public static generate(): StatsID {
    return StatsID.of(UUID.v4());
  }

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

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsID)) {
      return false;
    }

    return this.uuid.equals(other.uuid);
  }

  public get(): UUID {
    return this.uuid;
  }

  public serialize(): string {
    return this.uuid.toString();
  }
}

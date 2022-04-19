import { ValueObject } from '@jamashita/anden-object';
import { UUID, UUIDError } from '@jamashita/anden-uuid';
import { StatsItemError } from './StatsItemError.js';

export class StatsItemID extends ValueObject {
  private readonly uuid: UUID;

  public static generate(): StatsItemID {
    return StatsItemID.of(UUID.v4());
  }

  public static of(uuid: UUID): StatsItemID {
    return new StatsItemID(uuid);
  }

  public static ofString(id: string): StatsItemID {
    try {
      return StatsItemID.of(UUID.of(id));
    }
    catch (err: unknown) {
      if (err instanceof UUIDError) {
        throw new StatsItemError('StatsItemID.ofString()', err);
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
    if (!(other instanceof StatsItemID)) {
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

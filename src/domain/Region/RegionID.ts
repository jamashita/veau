import { ValueObject } from '@jamashita/anden-object';
import { UUID, UUIDError } from '@jamashita/anden-uuid';
import { RegionError } from './RegionError.js';

export class RegionID extends ValueObject {
  private readonly uuid: UUID;

  private static readonly EMPTY: RegionID = new RegionID(UUID.v5());

  public static empty(): RegionID {
    return RegionID.EMPTY;
  }

  public static of(uuid: UUID): RegionID {
    return new RegionID(uuid);
  }

  public static ofString(id: string): RegionID {
    try {
      return RegionID.of(UUID.of(id));
    }
    catch (err: unknown) {
      if (err instanceof UUIDError) {
        throw new RegionError('RegionID.ofString()', err);
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
    if (!(other instanceof RegionID)) {
      return false;
    }

    return this.uuid.equals(other.uuid);
  }

  public get(): UUID {
    return this.uuid;
  }

  public isEmpty(): boolean {
    return this === RegionID.empty();
  }

  public serialize(): string {
    return this.uuid.toString();
  }
}

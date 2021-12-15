import { ValueObject } from '@jamashita/anden-object';
import { UUID, UUIDError } from '@jamashita/anden-uuid';
import { RegionError } from './error/RegionError.js';

export class RegionID extends ValueObject<'RegionID'> {
  public readonly noun: 'RegionID' = 'RegionID';
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

  public serialize(): string {
    return this.uuid.toString();
  }

  public get(): UUID {
    return this.uuid;
  }

  public isEmpty(): boolean {
    return this === RegionID.empty();
  }
}

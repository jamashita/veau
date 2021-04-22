import { ValueObject } from '@jamashita/anden-object';
import { UUID, UUIDError } from '@jamashita/anden-uuid';
import { RegionError } from './Error/RegionError';

export class RegionID extends ValueObject<'RegionID'> {
  public readonly noun: 'RegionID' = 'RegionID';
  private readonly uuid: UUID;

  private static readonly EMPTY: RegionID = new RegionID(UUID.v5());

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

  public static empty(): RegionID {
    return RegionID.EMPTY;
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public equals(other: RegionID): boolean {
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

  public isEmpty(): boolean {
    if (this === RegionID.empty()) {
      return true;
    }

    return false;
  }
}

import { Alive, Dead, Superposition, UUID, UUIDError, ValueObject } from 'publikum';
import { RegionIDError } from '../Error/RegionIDError';

export class RegionID extends ValueObject {
  public readonly noun: 'RegionID' = 'RegionID';
  private readonly uuid: UUID;

  private static readonly EMPTY: RegionID = new RegionID(UUID.v5());

  public static of(uuid: UUID): RegionID {
    return new RegionID(uuid);
  }

  public static ofString(id: string): Superposition<RegionID, RegionIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Alive.of<RegionID, RegionIDError>(RegionID.of(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Dead.of<RegionID, RegionIDError>(
          new RegionIDError('RegionID.ofString()', err)
        );
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

  public get(): UUID {
    return this.uuid;
  }

  public isEmpty(): boolean {
    if (this === RegionID.empty()) {
      return true;
    }

    return false;
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
}

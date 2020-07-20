import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';

import { RegionIDError } from './Error/RegionIDError';

export class RegionID extends ValueObject<RegionID, 'RegionID'> {
  public readonly noun: 'RegionID' = 'RegionID';
  private readonly uuid: UUID;
  private static readonly EMPTY: RegionID = new RegionID(UUID.v5());

  public static of(uuid: UUID): RegionID {
    return new RegionID(uuid);
  }

  public static ofString(id: string): Superposition<RegionID, RegionIDError> {
    return Superposition.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }, UUIDError).transform<RegionID, RegionIDError>(
      (uuid: UUID) => {
        return RegionID.of(uuid);
      },
      (err: UUIDError) => {
        throw new RegionIDError('RegionID.ofString()', err);
      },
      RegionIDError
    );
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

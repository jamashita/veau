import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';

import { VeauAccountIDError } from './Error/VeauAccountIDError';

export class VeauAccountID extends ValueObject<VeauAccountID, 'VeauAccountID'> {
  public readonly noun: 'VeauAccountID' = 'VeauAccountID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): VeauAccountID {
    return new VeauAccountID(uuid);
  }

  public static ofString(id: string): Superposition<VeauAccountID, VeauAccountIDError> {
    return Superposition.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }, UUIDError).transform<VeauAccountID, VeauAccountIDError>(
      (uuid: UUID) => {
        return VeauAccountID.of(uuid);
      },
      (err: UUIDError) => {
        throw new VeauAccountIDError('VeauAccountID.ofString()', err);
      },
      VeauAccountIDError
    );
  }

  public static generate(): VeauAccountID {
    return VeauAccountID.of(UUID.v4());
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public equals(other: VeauAccountID): boolean {
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

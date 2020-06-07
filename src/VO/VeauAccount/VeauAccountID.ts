import { Alive, Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';

import { VeauAccountIDError } from './Error/VeauAccountIDError';

export class VeauAccountID extends ValueObject<VeauAccountID> {
  public readonly noun: 'VeauAccountID' = 'VeauAccountID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): VeauAccountID {
    return new VeauAccountID(uuid);
  }

  public static ofString(id: string): Superposition<VeauAccountID, VeauAccountIDError> {
    return Schrodinger.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }).transform<VeauAccountID, VeauAccountIDError>(
      (uuid: UUID) => {
        return Alive.of<VeauAccountID, VeauAccountIDError>(VeauAccountID.of(uuid));
      },
      (err: UUIDError) => {
        return Dead.of<VeauAccountID, VeauAccountIDError>(new VeauAccountIDError('VeauAccountID.ofString()', err));
      }
    );
  }

  public static generate(): VeauAccountID {
    return VeauAccountID.of(UUID.v4());
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public get(): UUID {
    return this.uuid;
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
}

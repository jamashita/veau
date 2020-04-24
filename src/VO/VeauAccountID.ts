import { Alive, Dead, Superposition, UUID, UUIDError, ValueObject } from 'publikum';
import { VeauAccountIDError } from '../Error/VeauAccountIDError';

export class VeauAccountID extends ValueObject {
  public readonly noun: 'VeauAccountID' = 'VeauAccountID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): VeauAccountID {
    return new VeauAccountID(uuid);
  }

  public static ofString(id: string): Superposition<VeauAccountID, VeauAccountIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Alive.of<VeauAccountID, VeauAccountIDError>(VeauAccountID.of(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Dead.of<VeauAccountID, VeauAccountIDError>(
          new VeauAccountIDError('VeauAccountID.ofString()', err)
        );
      }

      throw err;
    }
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

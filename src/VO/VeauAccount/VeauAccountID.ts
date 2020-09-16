import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';
import { VeauAccountError } from './Error/VeauAccountError';

export class VeauAccountID extends ValueObject<VeauAccountID, 'VeauAccountID'> {
  public readonly noun: 'VeauAccountID' = 'VeauAccountID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): VeauAccountID {
    return new VeauAccountID(uuid);
  }

  public static ofString(id: string): VeauAccountID {
    try {
      return VeauAccountID.of(UUID.of(id));
    }
    catch (err: unknown) {
      if (err instanceof UUIDError) {
        throw new VeauAccountError('VeauAccountID.ofString()', err);
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

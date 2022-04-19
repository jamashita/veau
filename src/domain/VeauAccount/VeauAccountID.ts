import { ValueObject } from '@jamashita/anden-object';
import { UUID, UUIDError } from '@jamashita/anden-uuid';
import { VeauAccountError } from './VeauAccountError.js';

export class VeauAccountID extends ValueObject {
  private readonly uuid: UUID;

  public static generate(): VeauAccountID {
    return VeauAccountID.of(UUID.v4());
  }

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

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof VeauAccountID)) {
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

import { VeauAccountIDError } from '../veau-error/VeauAccountIDError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { UUID } from '../veau-general/UUID/UUID';
import { UUIDError } from '../veau-general/UUID/UUIDError';
import { ValueObject } from '../veau-general/ValueObject';

export class VeauAccountID extends ValueObject {
  public readonly noun: 'VeauAccountID' = 'VeauAccountID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): VeauAccountID {
    return new VeauAccountID(uuid);
  }

  public static ofString(id: string): Try<VeauAccountID, VeauAccountIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Success.of<VeauAccountID, VeauAccountIDError>(new VeauAccountID(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Failure.of<VeauAccountID, VeauAccountIDError>(new VeauAccountIDError(err));
      }

      throw err;
    }
  }

  public static generate(): VeauAccountID {
    return new VeauAccountID(UUID.v4());
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
    if (this.uuid.equals(other.uuid)) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.uuid.toString();
  }
}

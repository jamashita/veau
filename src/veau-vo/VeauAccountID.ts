import { VeauAccountIDError } from '../veau-error/VeauAccountIDError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { UUID } from '../veau-general/UUID';
import { ValueObject } from '../veau-general/ValueObject';

export class VeauAccountID extends ValueObject {
  public readonly noun: 'VeauAccountID' = 'VeauAccountID';
  private readonly id: string;

  public static of(id: string): Try<VeauAccountID, VeauAccountIDError> {
    if (id.length === UUID.size()) {
      return Success.of<VeauAccountID, VeauAccountIDError>(new VeauAccountID(id));
    }

    return Failure.of<VeauAccountID, VeauAccountIDError>(new VeauAccountIDError(`VeauAccountID requires ${UUID.size()} LENGTH`));
  }

  public static generate(): VeauAccountID {
    return new VeauAccountID(UUID.v4());
  }

  private constructor(id: string) {
    super();
    this.id = id;
  }

  public get(): string {
    return this.id;
  }

  public equals(other: VeauAccountID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.id;
  }
}

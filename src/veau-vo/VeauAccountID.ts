import { RuntimeError } from '../veau-general/RuntimeError';
import { UUID } from '../veau-general/UUID';
import { ValueObject } from '../veau-general/ValueObject';

export class VeauAccountID extends ValueObject {
  private id: string;

  public static of(id: string): VeauAccountID {
    if (id.length === UUID.size()) {
      return new VeauAccountID(id);
    }

    throw new RuntimeError(`VeauAccountID requires ${UUID.size().toString()} LENGTH`);
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

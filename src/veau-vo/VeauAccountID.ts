import { UUID } from './UUID';
import { ValueObject } from './ValueObject';

export class VeauAccountID extends ValueObject {
  private id: UUID;

  public static of(id: UUID): VeauAccountID {
    return new VeauAccountID(id);
  }

  public static default(): VeauAccountID {
    return new VeauAccountID(UUID.of(''));
  }

  private constructor(id: UUID) {
    super();
    this.id = id;
  }

  public get(): UUID {
    return this.id;
  }

  public equals(other: VeauAccountID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id.equals(other.get())) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.id.toString();
  }
}

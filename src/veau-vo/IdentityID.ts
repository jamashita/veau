import { UUID } from './UUID';
import { ValueObject } from './ValueObject';

export class IdentityID extends ValueObject {
  private id: UUID;

  public static of(id: UUID): IdentityID {
    return new IdentityID(id);
  }

  public static default(): IdentityID {
    return new IdentityID(UUID.of(''));
  }

  private constructor(id: UUID) {
    super();
    this.id = id;
  }

  public get(): UUID {
    return this.id;
  }

  public equals(other: IdentityID): boolean {
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

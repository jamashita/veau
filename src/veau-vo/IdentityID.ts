import { ValueObject } from './ValueObject';

export class IdentityID extends ValueObject {
  private id: number;

  public static of(id: number): IdentityID {
    return new IdentityID(id);
  }

  public static default(): IdentityID {
    return new IdentityID(0);
  }

  private constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public equals(other: IdentityID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.id.toString();
  }
}

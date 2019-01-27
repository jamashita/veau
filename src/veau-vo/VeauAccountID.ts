import { ValueObject } from './ValueObject';

export class VeauAccountID extends ValueObject {
  private id: number;

  public static of(id: number): VeauAccountID {
    return new VeauAccountID(id);
  }

  private constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
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
    return this.id.toString();
  }
}

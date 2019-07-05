import { ValueObject } from './ValueObject';

export class VeauAccountID extends ValueObject {
  private id: string;

  public static of(id: string): VeauAccountID {
    return new VeauAccountID(id);
  }

  public static default(): VeauAccountID {
    return new VeauAccountID('');
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

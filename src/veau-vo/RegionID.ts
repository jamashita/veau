import { ValueObject } from '../veau-general/ValueObject';

export class RegionID extends ValueObject {
  private id: number;

  public static of(id: number): RegionID {
    return new RegionID(id);
  }

  private constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public equals(other: RegionID): boolean {
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

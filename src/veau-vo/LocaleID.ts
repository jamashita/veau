import { ValueObject } from './ValueObject';

export class LocaleID extends ValueObject {
  private id: number;

  public static of(id: number): LocaleID {
    return new LocaleID(id);
  }

  private constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public equals(other: LocaleID): boolean {
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

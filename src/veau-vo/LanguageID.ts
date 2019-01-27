import { ValueObject } from './ValueObject';

export class LanguageID extends ValueObject {
  private id: number;

  public static of(id: number): LanguageID {
    return new LanguageID(id);
  }

  private constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public equals(other: LanguageID): boolean {
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

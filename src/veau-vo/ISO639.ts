import { ValueObject } from '../veau-general/ValueObject';

export class ISO639 extends ValueObject {
  private iso639: string;

  public static of(iso639: string): ISO639 {
    return new ISO639(iso639);
  }

  public static default(): ISO639 {
    return new ISO639('');
  }

  private constructor(iso639: string) {
    super();
    this.iso639 = iso639;
  }

  public get(): string {
    return this.iso639;
  }

  public equals(other: ISO639): boolean {
    if (this === other) {
      return true;
    }
    if (this.iso639 === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.iso639;
  }
}

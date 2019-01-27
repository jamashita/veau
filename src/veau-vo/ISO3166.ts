import { ValueObject } from './ValueObject';

export class ISO3166 extends ValueObject {
  private iso3166: string;

  public static of(iso3166: string): ISO3166 {
    return new ISO3166(iso3166);
  }

  public static default(): ISO3166 {
    return new ISO3166('');
  }

  public constructor(iso3166: string) {
    super();
    this.iso3166 = iso3166;
  }

  public get(): string {
    return this.iso3166;
  }

  public equals(other: ISO3166): boolean {
    if (this === other) {
      return true;
    }
    if (this.iso3166 === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.iso3166;
  }
}

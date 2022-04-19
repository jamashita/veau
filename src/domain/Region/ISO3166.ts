import { ValueObject } from '@jamashita/anden-object';

const EMPTY_CODE: string = '';

export class ISO3166 extends ValueObject {
  private readonly iso3166: string;

  private static readonly EMPTY: ISO3166 = new ISO3166(EMPTY_CODE);

  public static empty(): ISO3166 {
    return ISO3166.EMPTY;
  }

  public static of(iso3166: string): ISO3166 {
    if (iso3166 === EMPTY_CODE) {
      return ISO3166.empty();
    }

    return new ISO3166(iso3166);
  }

  protected constructor(iso3166: string) {
    super();
    this.iso3166 = iso3166;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof ISO3166)) {
      return false;
    }

    return this.iso3166 === other.iso3166;
  }

  public get(): string {
    return this.iso3166;
  }

  public isEmpty(): boolean {
    return this === ISO3166.empty();
  }

  public serialize(): string {
    return this.iso3166;
  }
}

import { ValueObject } from '../General/ValueObject';

const EMPTY_CODE: string = '';

export class ISO3166 extends ValueObject {
  public readonly noun: 'ISO3166' = 'ISO3166';
  private readonly iso3166: string;

  private static readonly EMPTY: ISO3166 = new ISO3166(EMPTY_CODE);

  public static of(iso3166: string): ISO3166 {
    if (iso3166 === EMPTY_CODE) {
      return ISO3166.empty();
    }

    return new ISO3166(iso3166);
  }

  public static empty(): ISO3166 {
    return ISO3166.EMPTY;
  }

  protected constructor(iso3166: string) {
    super();
    this.iso3166 = iso3166;
  }

  public get(): string {
    return this.iso3166;
  }

  public isEmpty(): boolean {
    if (this === ISO3166.empty()) {
      return true;
    }

    return false;
  }

  public equals(other: ISO3166): boolean {
    if (this === other) {
      return true;
    }
    if (this.iso3166 === other.iso3166) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.iso3166;
  }
}

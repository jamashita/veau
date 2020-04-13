import { ValueObject } from '../General/ValueObject';

const DEFAULT_CODE: string = '';

export class ISO639 extends ValueObject {
  public readonly noun: 'ISO639' = 'ISO639';
  private readonly iso639: string;

  private static readonly DEFAULT: ISO639 = new ISO639(DEFAULT_CODE);

  public static of(iso639: string): ISO639 {
    if (iso639 === DEFAULT_CODE) {
      return ISO639.default();
    }

    return new ISO639(iso639);
  }

  public static default(): ISO639 {
    return ISO639.DEFAULT;
  }

  protected constructor(iso639: string) {
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
    if (this.iso639 === other.iso639) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.iso639;
  }
}

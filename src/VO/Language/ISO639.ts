import { ValueObject } from '@jamashita/anden-object';

const EMPTY_CODE: string = '';

export class ISO639 extends ValueObject<'ISO639'> {
  public readonly noun: 'ISO639' = 'ISO639';
  private readonly iso639: string;

  private static readonly EMPTY: ISO639 = new ISO639(EMPTY_CODE);

  public static of(iso639: string): ISO639 {
    if (iso639 === EMPTY_CODE) {
      return ISO639.empty();
    }

    return new ISO639(iso639);
  }

  public static empty(): ISO639 {
    return ISO639.EMPTY;
  }

  protected constructor(iso639: string) {
    super();
    this.iso639 = iso639;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof ISO639)) {
      return false;
    }
    if (this.iso639 === other.iso639) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.iso639;
  }

  public get(): string {
    return this.iso639;
  }

  public isEmpty(): boolean {
    return this === ISO639.empty();
  }
}

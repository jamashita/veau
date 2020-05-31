import { ValueObject } from '@jamashita/publikum-object';

export class Color extends ValueObject {
  public readonly noun: 'Color' = 'Color';
  private readonly rgb: string;

  public static of(rgb: string): Color {
    return new Color(rgb);
  }

  protected constructor(rgb: string) {
    super();
    this.rgb = rgb;
  }

  public get(): string {
    return this.rgb;
  }

  public equals(other: Color): boolean {
    if (this === other) {
      return true;
    }
    if (this.rgb === other.rgb) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.rgb;
  }
}

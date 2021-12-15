import { ValueObject } from '@jamashita/anden-object';

export class Color extends ValueObject<'Color'> {
  public readonly noun: 'Color' = 'Color';
  private readonly rgb: string;

  public static readonly NO_COLOR: Color = new Color('#000000');

  public static of(rgb: string): Color {
    return new Color(rgb);
  }

  protected constructor(rgb: string) {
    super();
    this.rgb = rgb;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Color)) {
      return false;
    }
    if (this.rgb === other.rgb) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.rgb;
  }

  public get(): string {
    return this.rgb;
  }
}

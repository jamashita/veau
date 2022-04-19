import { ValueObject } from '@jamashita/anden-object';

export class Color extends ValueObject {
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

    return this.rgb === other.rgb;
  }

  public get(): string {
    return this.rgb;
  }

  public serialize(): string {
    return this.rgb;
  }
}

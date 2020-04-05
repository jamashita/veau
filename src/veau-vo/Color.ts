import { ValueObject } from '../veau-general/ValueObject';

export class Color extends ValueObject {
  public readonly noun: 'Color' = 'Color';
  private rgb: string;

  public static of(rgb: string): Color {
    return new Color(rgb);
  }

  private constructor(rgb: string) {
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
    if (this.rgb === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.rgb;
  }
}

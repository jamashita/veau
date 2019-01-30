import { Random } from '../veau-general/Random';
import { ValueObject } from './ValueObject';

const HEX: number = 16;
const MIN_HEX: number = 0;
const MAX_HEX: number = 220;

export class Color extends ValueObject {
  private r: number;
  private g: number;
  private b: number;

  public static of(r: number, g: number, b: number): Color {
    return new Color(r, g, b);
  }

  public static random(): Color {
    const r: number = Random.integer(MIN_HEX, MAX_HEX);
    const g: number = Random.integer(MIN_HEX, MAX_HEX);
    const b: number = Random.integer(MIN_HEX, MAX_HEX);

    return new Color(r, g, b);
  }

  private constructor(r: number, g: number, b: number) {
    super();
    this.r = r;
    this.g = g;
    this.b = b;
  }

  public getR(): number {
    return this.r;
  }

  public getG(): number {
    return this.g;
  }

  public getB(): number {
    return this.b;
  }

  public toRGB(): string {
    const {
      r,
      g,
      b
    } = this;

    return `#${r.toString(HEX)}${g.toString(HEX)}${b.toString(HEX)}`;
  }

  public equals(other: Color): boolean {
    if (this === other) {
      return true;
    }
    if (this.r !== other.getR()) {
      return false;
    }
    if (this.g !== other.getG()) {
      return false;
    }
    if (this.b !== other.getB()) {
      return false;
    }

    return true;
  }

  public toString(): string {
    const {
      r,
      g,
      b
    } = this;

    return `r: ${r}, g: ${g}, b: ${b}`;
  }
}

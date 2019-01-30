import { ValueObject } from './ValueObject';

export type CoordinateJSON = {
  x: number | string;
  y: number;
};

export class Coordinate extends ValueObject {
  private x: number | string;
  private y: number;

  public static of(x: number | string, y: number): Coordinate {
    return new Coordinate(x, y);
  }

  private constructor(x: number | string, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  public getX(): number | string {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public equals(other: Coordinate): boolean {
    if (this === other) {
      return true;
    }
    if (this.x !== other.getX()) {
      return false;
    }
    if (this.y !== other.getY()) {
      return false;
    }

    return true;
  }

  public toJSON(): CoordinateJSON {
    const {
      x,
      y
    } = this;

    return {
      x,
      y
    };
  }

  public toString(): string {
    const {
      x,
      y
    } = this;

    return `x: ${x}, y: ${y}`;
  }
}

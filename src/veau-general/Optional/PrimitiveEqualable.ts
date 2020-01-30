import { Equalable } from '../Equalable';
import { Serializable } from '../Serializable';
import { Primitive } from '../Type/Primitive';

export class PrimitiveEqualable implements Equalable, Serializable {
  private value: Primitive;

  public static of(value: Primitive): PrimitiveEqualable {
    return new PrimitiveEqualable(value);
  }

  private constructor(value: Primitive) {
    this.value = value;
  }

  public get(): Primitive {
    return this.value;
  }

  public equals(other: PrimitiveEqualable): boolean {
    return this.value === other.get();
  }

  public toString(): string {
    const {
      value
    } = this;

    if (value === null) {
      return 'null';
    }
    if (value === undefined) {
      return 'undefined';
    }

    return value.toString();
  }
}

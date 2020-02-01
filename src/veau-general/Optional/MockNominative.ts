import { Nominative } from '../Nominative';
import { Primitive } from '../Type/Primitive';

export class MockNominative implements Nominative {
  private value: Primitive;

  public static of(value: Primitive): MockNominative {
    return new MockNominative(value);
  }

  private constructor(value: Primitive) {
    this.value = value;
  }

  public get(): Primitive {
    return this.value;
  }

  public equals(other: MockNominative): boolean {
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

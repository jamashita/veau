import { Nominative } from './Nominative';
import { Primitive } from './Type/Value';

export class MockNominative<E extends Primitive> implements Nominative {
  public readonly noun: 'MockNominative' = 'MockNominative';
  private readonly value: E;

  public constructor(value: E) {
    this.value = value;
  }

  public get(): Primitive {
    return this.value;
  }

  public equals(other: MockNominative<E>): boolean {
    if (this === other) {
      return true;
    }
    if (this.value === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    const {
      value
    } = this;

    if (value === undefined) {
      return 'undefined';
    }
    if (value === null) {
      return 'null';
    }

    return value.toString();
  }
}

import { ValueObject } from '../Object/ValueObject';
import { Primitive } from '../Type/Value';

export class MockNominative<T extends Primitive> extends ValueObject {
  public readonly noun: 'MockNominative' = 'MockNominative';
  private readonly value: T;

  public constructor(value: T) {
    super();
    this.value = value;
  }

  public get(): T {
    return this.value;
  }

  public equals(other: MockNominative<T>): boolean {
    if (this === other) {
      return true;
    }
    if (this.value === other.value) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    if (this.value === undefined) {
      return 'undefined';
    }
    if (this.value === null) {
      return 'null';
    }

    return this.value.toString();
  }
}

import { Objet } from '../Object/Objet';
import { Primitive } from '../Type/Value';

export class MockNominative<E extends Primitive> extends Objet {
  public readonly noun: 'MockNominative' = 'MockNominative';
  private readonly value: E;

  public constructor(value: E) {
    super();
    this.value = value;
  }

  public get(): E {
    return this.value;
  }

  public equals(other: MockNominative<E>): boolean {
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

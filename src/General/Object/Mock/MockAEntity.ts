import { MockNominative } from '../../Mock/MockNominative';
import { JSObjectNotation, Primitive } from '../../Type/Value';
import { UnimplementedError } from '../../UnimplementedError';
import { Entity } from '../Entity';

export class MockAEntity<T extends Primitive> extends Entity<MockNominative<T>> {
  public readonly noun: 'MockAEntity' = 'MockAEntity';
  private readonly id: MockNominative<T>;
  public other: JSObjectNotation;

  public constructor(id: MockNominative<T>, other: JSObjectNotation) {
    super();
    this.id = id;
    this.other = other;
  }

  public getIdentifier(): MockNominative<T> {
    return this.id;
  }

  public duplicate(): MockAEntity<T> {
    throw new UnimplementedError();
  }

  public toJSON(): JSObjectNotation {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}

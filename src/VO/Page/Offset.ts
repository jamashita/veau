import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';
import { PageError } from './Error/PageError';

export class Offset extends ValueObject<Offset, 'Offset'> {
  public readonly noun: 'Offset' = 'Offset';
  private readonly offset: number;

  public static of(offset: number): Offset {
    if (offset < 0) {
      throw new PageError(`ILLEGAL OFFSET SPECIFIED ${offset}`);
    }
    if (Kind.isInteger(offset)) {
      return new Offset(offset);
    }

    throw new PageError(`ILLEGAL OFFSET SPECIFIED: ${Kind.notate(offset)}`);
  }

  protected constructor(offset: number) {
    super();
    this.offset = offset;
  }

  public equals(other: Offset): boolean {
    if (this === other) {
      return true;
    }
    if (this.offset === other.offset) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.offset}`;
  }

  public get(): number {
    return this.offset;
  }
}

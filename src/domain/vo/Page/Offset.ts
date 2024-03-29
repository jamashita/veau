import { ValueObject } from '@jamashita/anden-object';
import { Kind } from '@jamashita/anden-type';
import { PageError } from './error/PageError.js';

export class Offset extends ValueObject<'Offset'> {
  public readonly noun: 'Offset' = 'Offset';
  private readonly offset: number;

  public static of(offset: number): Offset {
    if (offset < 0) {
      throw new PageError(`ILLEGAL OFFSET SPECIFIED ${offset}`);
    }
    if (Kind.isInteger(offset)) {
      return new Offset(offset);
    }

    throw new PageError(`ILLEGAL OFFSET SPECIFIED: ${offset}`);
  }

  protected constructor(offset: number) {
    super();
    this.offset = offset;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Offset)) {
      return false;
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

import { ValueObject } from '@jamashita/anden-object';
import { Kind } from '@jamashita/anden-type';
import { HeaderSizeError } from './error/HeaderSizeError.js';

const REVISED_VALUE: number = 14;

export class HeaderSize extends ValueObject<'HeaderSize'> {
  public readonly noun: 'HeaderSize' = 'HeaderSize';
  private readonly chars: number;

  public static default(): HeaderSize {
    return HeaderSize.ofPositiveInteger(1);
  }

  public static of(chars: number): HeaderSize {
    if (chars < 0) {
      throw new HeaderSizeError(`ILLEGAL SIZE SPECIFIED ${chars}`);
    }
    if (Kind.isInteger(chars)) {
      return HeaderSize.ofPositiveInteger(chars);
    }

    throw new HeaderSizeError(`ILLEGAL SIZE SPECIFIED: ${chars}`);
  }

  private static ofPositiveInteger(num: number): HeaderSize {
    return new HeaderSize(num * REVISED_VALUE);
  }

  public static ofString(str: string): HeaderSize {
    return HeaderSize.ofPositiveInteger(str.length);
  }

  protected constructor(chars: number) {
    super();
    this.chars = chars;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof HeaderSize)) {
      return false;
    }
    if (this.chars === other.chars) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.chars}`;
  }

  public get(): number {
    return this.chars;
  }
}

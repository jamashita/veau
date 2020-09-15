import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';
import { HeaderSizeError } from './Error/HeaderSizeError';

const REVISED_VALUE: number = 14;

export class HeaderSize extends ValueObject<HeaderSize, 'HeaderSize'> {
  public readonly noun: 'HeaderSize' = 'HeaderSize';
  private readonly chars: number;

  public static of(chars: number): HeaderSize {
    if (chars < 0) {
      throw new HeaderSizeError(`ILLEGAL SIZE SPECIFIED ${chars}`);
    }
    if (Kind.isInteger(chars)) {
      return HeaderSize.ofPositiveInteger(chars);
    }

    throw new HeaderSizeError('ILLEGAL SIZE SPECIFIED');
  }

  public static ofString(str: string): HeaderSize {
    return HeaderSize.ofPositiveInteger(str.length);
  }

  private static ofPositiveInteger(num: number): HeaderSize {
    return new HeaderSize(num * REVISED_VALUE);
  }

  public static default(): HeaderSize {
    return HeaderSize.ofPositiveInteger(1);
  }

  protected constructor(chars: number) {
    super();
    this.chars = chars;
  }

  public equals(other: HeaderSize): boolean {
    if (this === other) {
      return true;
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

import { ValueObject } from '@jamashita/anden-object';

export class Hash extends ValueObject {
  private readonly h: string;

  public static of(hash: string): Hash {
    return new Hash(hash);
  }

  protected constructor(hash: string) {
    super();
    this.h = hash;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Hash)) {
      return false;
    }

    return this.h === other.h;
  }

  public serialize(): string {
    return this.h;
  }

  public get(): string {
    return this.h;
  }
}

import { ValueObject } from '@jamashita/anden-object';

export class Hash extends ValueObject<'Hash'> {
  public readonly noun: 'Hash' = 'Hash';
  private readonly hash: string;

  public static of(hash: string): Hash {
    return new Hash(hash);
  }

  protected constructor(hash: string) {
    super();
    this.hash = hash;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Hash)) {
      return false;
    }
    if (this.hash === other.hash) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.hash;
  }

  public get(): string {
    return this.hash;
  }
}

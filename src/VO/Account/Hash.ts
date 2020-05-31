import { ValueObject } from '@jamashita/publikum-object';

export class Hash extends ValueObject {
  public readonly noun: 'Hash' = 'Hash';
  private readonly hash: string;

  public static of(hash: string): Hash {
    return new Hash(hash);
  }

  protected constructor(hash: string) {
    super();
    this.hash = hash;
  }

  public get(): string {
    return this.hash;
  }

  public equals(other: Hash): boolean {
    if (this === other) {
      return true;
    }
    if (this.hash === other.hash) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.hash;
  }
}

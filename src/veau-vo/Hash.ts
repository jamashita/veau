import { ValueObject } from '../veau-general/ValueObject';

export class Hash extends ValueObject {
  private hash: string;

  public static of(hash: string): Hash {
    return new Hash(hash);
  }

  private constructor(hash: string) {
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
    if (this.hash === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.hash;
  }
}

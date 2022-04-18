import { ValueObject } from '@jamashita/anden-object';

export class TermKey extends ValueObject {
  private readonly key: string;

  public static of(key: string): TermKey {
    return new TermKey(key);
  }

  protected constructor(key: string) {
    super();
    this.key = key;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof TermKey)) {
      return false;
    }

    return this.key === other.key;
  }

  public serialize(): string {
    return this.key;
  }

  public get(): string {
    return this.key;
  }
}

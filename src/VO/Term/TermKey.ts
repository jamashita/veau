import { ValueObject } from '@jamashita/anden-object';

export class TermKey extends ValueObject<'TermKey'> {
  public readonly noun: 'TermKey' = 'TermKey';
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
    if (this.key === other.key) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.key;
  }

  public get(): string {
    return this.key;
  }
}

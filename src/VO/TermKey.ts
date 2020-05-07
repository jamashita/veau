import { ValueObject } from 'publikum';

export class TermKey extends ValueObject {
  public readonly noun: 'TermKey' = 'TermKey';
  private readonly key: string;

  public static of(key: string): TermKey {
    return new TermKey(key);
  }

  protected constructor(key: string) {
    super();
    this.key = key;
  }

  public get(): string {
    return this.key;
  }

  public equals(other: TermKey): boolean {
    if (this === other) {
      return true;
    }
    if (this.key === other.key) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.key;
  }
}

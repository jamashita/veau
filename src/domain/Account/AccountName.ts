import { ValueObject } from '@jamashita/anden-object';

const EMPTY_NAME: string = '';

export class AccountName extends ValueObject {
  private readonly name: string;

  private static readonly EMPTY: AccountName = new AccountName(EMPTY_NAME);

  public static empty(): AccountName {
    return AccountName.EMPTY;
  }

  public static of(name: string): AccountName {
    if (name === EMPTY_NAME) {
      return AccountName.empty();
    }

    return new AccountName(name);
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof AccountName)) {
      return false;
    }

    return this.name === other.name;
  }

  public serialize(): string {
    return this.name;
  }

  public get(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    return this === AccountName.empty();
  }
}

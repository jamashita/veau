import { ValueObject } from '@jamashita/anden-object';

const EMPTY_NAME: string = '';

export class AccountName extends ValueObject<'AccountName'> {
  public readonly noun: 'AccountName' = 'AccountName';
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
    if (this.name === other.name) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.name;
  }

  public get(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    if (this === AccountName.empty()) {
      return true;
    }

    return false;
  }
}

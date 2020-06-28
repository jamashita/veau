import { ValueObject } from '@jamashita/publikum-object';

const EMPTY_NAME: string = '';

export class AccountName extends ValueObject<AccountName, 'AccountName'> {
  public readonly noun: 'AccountName' = 'AccountName';
  private readonly name: string;

  private static readonly EMPTY: AccountName = new AccountName(EMPTY_NAME);

  public static of(name: string): AccountName {
    if (name === EMPTY_NAME) {
      return AccountName.empty();
    }

    return new AccountName(name);
  }

  public static empty(): AccountName {
    return AccountName.EMPTY;
  }

  protected constructor(name: string) {
    super();
    this.name = name;
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

  public equals(other: AccountName): boolean {
    if (this === other) {
      return true;
    }
    if (this.name === other.name) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.name;
  }
}

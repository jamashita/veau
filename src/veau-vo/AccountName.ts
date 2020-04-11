import { ValueObject } from '../veau-general/ValueObject';

const DEFAULT_NAME: string = '';

export class AccountName extends ValueObject {
  public readonly noun: 'AccountName' = 'AccountName';
  private readonly name: string;

  private static readonly DEFAULT: AccountName = AccountName.of(DEFAULT_NAME);

  public static of(name: string): AccountName {
    return new AccountName(name);
  }

  public static default(): AccountName {
    return AccountName.DEFAULT;
  }

  private constructor(name: string) {
    super();
    this.name = name;
  }

  public get(): string {
    return this.name;
  }

  public isDefault(): boolean {
    if (this === AccountName.DEFAULT) {
      return true;
    }
    if (this.name === DEFAULT_NAME) {
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

  public toString(): string {
    return this.name;
  }
}

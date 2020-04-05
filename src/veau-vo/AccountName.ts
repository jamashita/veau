import { ValueObject } from '../veau-general/ValueObject';

export class AccountName extends ValueObject {
  public readonly noun: 'AccountName' = 'AccountName';
  private readonly name: string;

  public static of(name: string): AccountName {
    return new AccountName(name);
  }

  public static default(): AccountName {
    return AccountName.of('');
  }

  private constructor(name: string) {
    super();
    this.name = name;
  }

  public get(): string {
    return this.name;
  }

  public isDefault(): boolean {
    if (this.name === '') {
      return true;
    }

    return false;
  }

  public equals(other: AccountName): boolean {
    if (this === other) {
      return true;
    }
    if (this.name === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.name;
  }
}

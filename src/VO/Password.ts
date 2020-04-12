import { ValueObject } from '../General/ValueObject';

const DEFAULT_PASSWORD: string = '';

export class Password extends ValueObject {
  public readonly noun: 'Password' = 'Password';
  private readonly password: string;

  private static readonly DEFAULT: Password = Password.of(DEFAULT_PASSWORD);

  public static of(password: string): Password {
    return new Password(password);
  }

  public static default(): Password {
    return Password.DEFAULT;
  }

  protected constructor(password: string) {
    super();
    this.password = password;
  }

  public get(): string {
    return this.password;
  }

  public isDefault(): boolean {
    if (this.password === DEFAULT_PASSWORD) {
      return true;
    }

    return false;
  }

  public equals(other: Password): boolean {
    if (this === other) {
      return true;
    }
    if (this.password === other.password) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.password;
  }
}

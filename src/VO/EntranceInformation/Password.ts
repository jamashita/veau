import { ValueObject } from '@jamashita/publikum-object';

const EMPTY_PASSWORD: string = '';

export class Password extends ValueObject<Password, 'Password'> {
  public readonly noun: 'Password' = 'Password';
  private readonly password: string;

  private static readonly EMPTY: Password = new Password(EMPTY_PASSWORD);

  public static of(password: string): Password {
    if (password === EMPTY_PASSWORD) {
      return Password.empty();
    }

    return new Password(password);
  }

  public static empty(): Password {
    return Password.EMPTY;
  }

  protected constructor(password: string) {
    super();
    this.password = password;
  }

  public get(): string {
    return this.password;
  }

  public isEmpty(): boolean {
    if (this === Password.empty()) {
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

  public serialize(): string {
    return this.password;
  }
}

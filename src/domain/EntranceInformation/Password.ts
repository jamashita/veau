import { ValueObject } from '@jamashita/anden-object';

const EMPTY_PASSWORD: string = '';

export class Password extends ValueObject {
  private readonly password: string;

  private static readonly EMPTY: Password = new Password(EMPTY_PASSWORD);

  public static empty(): Password {
    return Password.EMPTY;
  }

  public static of(password: string): Password {
    if (password === EMPTY_PASSWORD) {
      return Password.empty();
    }

    return new Password(password);
  }

  protected constructor(password: string) {
    super();
    this.password = password;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Password)) {
      return false;
    }

    return this.password === other.password;
  }

  public serialize(): string {
    return this.password;
  }

  public get(): string {
    return this.password;
  }

  public isEmpty(): boolean {
    return this === Password.empty();
  }
}

import { ValueObject } from '../veau-general/ValueObject';

export class Password extends ValueObject {
  public readonly noun: 'Password' = 'Password';
  private password: string;

  public static of(password: string): Password {
    return new Password(password);
  }

  public static default(): Password {
    return Password.of('');
  }

  private constructor(password: string) {
    super();
    this.password = password;
  }

  public get(): string {
    return this.password;
  }

  public isDefault(): boolean {
    if (this.password === '') {
      return true;
    }

    return false;
  }

  public equals(other: Password): boolean {
    if (this === other) {
      return true;
    }
    if (this.password === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.password;
  }
}

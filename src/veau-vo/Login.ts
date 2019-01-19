import {ValueObject} from './ValueObject';

export type LoginJSON = {
  account: string;
  password: string;
};

export class Login extends ValueObject {
  private account: string;
  private password: string;

  public static of(account: string, password: string): Login {
    return new Login(account, password);
  }

  public static default(): Login {
    return new Login('', '');
  }

  private constructor(account: string, password: string) {
    super();
    this.account = account;
    this.password = password;
  }

  public getAccount(): string {
    return this.account;
  }

  public getPassword(): string {
    return this.password;
  }

  public isAcceptable(): boolean {
    if (this.account === '') {
      return false;
    }
    if (this.password === '') {
      return false;
    }

    return true;
  }

  public equals(other: Login): boolean {
    if (this === other) {
      return true;
    }
    if (this.account !== other.getAccount()) {
      return false;
    }
    if (this.password !== other.getPassword()) {
      return false;
    }

    return true;
  }

  public toJSON(): LoginJSON {
    const {
      account,
      password
    } = this;

    return {
      account,
      password
    };
  }

  public toString(): string {
    const {
      account,
      password
    } = this;

    return `account: ${account}, password: ${password}`;
  }
}

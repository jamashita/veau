type LoginJSON = {
  name: string;
  password: string;
}

export class Login {
  private name: string;
  private password: string;

  public constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }

  public static default(): Login {
    return new Login('', '');
  }

  public getName(): string {
    return this.name;
  }

  public getPassword(): string {
    return this.password;
  }

  public isAcceptable(): boolean {
    if (this.name === '') {
      return false;
    }
    if (this.password === '') {
      return false;
    }
    return true;
  }

  public equals(other: Login): boolean {
    if (this.name !== other.getName()) {
      return false;
    }
    if (this.password !== other.getPassword()) {
      return false;
    }
    return true;
  }

  public toJSON(): LoginJSON {
    const {
      name,
      password
    } = this;

    return {
      name,
      password
    };
  }
}

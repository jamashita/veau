import { JSONable } from '../veau-general/JSONable';
import { ValueObject } from '../veau-general/ValueObject';

export type EntranceInformationJSON = {
  account: string;
  password: string;
};

export class EntranceInformation extends ValueObject implements JSONable {
  private account: string;
  private password: string;

  public static of(account: string, password: string): EntranceInformation {
    return new EntranceInformation(account, password);
  }

  public static default(): EntranceInformation {
    return new EntranceInformation('', '');
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

  public equals(other: EntranceInformation): boolean {
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

  public toJSON(): EntranceInformationJSON {
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

    return `${account} ${password}`;
  }
}

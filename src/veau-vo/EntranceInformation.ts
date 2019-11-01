import { JSONable } from '../veau-general/JSONable';
import { ValueObject } from '../veau-general/ValueObject';
import { AccountName } from './AccountName';
import { Password } from './Password';

export type EntranceInformationJSON = {
  account: string;
  password: string;
};

export class EntranceInformation extends ValueObject implements JSONable {
  private account: AccountName;
  private password: Password;

  public static of(account: AccountName, password: Password): EntranceInformation {
    return new EntranceInformation(account, password);
  }

  public static default(): EntranceInformation {
    return new EntranceInformation(AccountName.default(), Password.default());
  }

  private constructor(account: AccountName, password: Password) {
    super();
    this.account = account;
    this.password = password;
  }

  public getAccount(): AccountName {
    return this.account;
  }

  public getPassword(): Password {
    return this.password;
  }

  public isAcceptable(): boolean {
    if (this.account.isDefault()) {
      return false;
    }
    if (this.password.isDefault()) {
      return false;
    }

    return true;
  }

  public equals(other: EntranceInformation): boolean {
    if (this === other) {
      return true;
    }

    const {
      account,
      password
    } = this;

    if (!account.equals(other.getAccount())) {
      return false;
    }
    if (!password.equals(other.getPassword())) {
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
      account: account.get(),
      password: password.get()
    };
  }

  public toString(): string {
    const {
      account,
      password
    } = this;

    return `${account.toString()} ${password.toString()}`;
  }
}

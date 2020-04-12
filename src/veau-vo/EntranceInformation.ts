import { JSONable } from '../veau-general/Interface/JSONable';
import { ValueObject } from '../veau-general/ValueObject';
import { AccountName } from './AccountName';
import { Password } from './Password';

export type EntranceInformationJSON = Readonly<{
  account: string;
  password: string;
}>;

export class EntranceInformation extends ValueObject implements JSONable {
  public readonly noun: 'EntranceInformation' = 'EntranceInformation';
  private readonly account: AccountName;
  private readonly password: Password;

  public static of(account: AccountName, password: Password): EntranceInformation {
    return new EntranceInformation(account, password);
  }

  public static default(): EntranceInformation {
    return new EntranceInformation(AccountName.default(), Password.default());
  }

  protected constructor(account: AccountName, password: Password) {
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

    if (!account.equals(other.account)) {
      return false;
    }
    if (!password.equals(other.password)) {
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

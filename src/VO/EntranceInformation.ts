import { JSONable } from '../General/Interface/JSONable';
import { ValueObject } from '../General/ValueObject';
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

  private static readonly EMPTY: EntranceInformation = new EntranceInformation(
    AccountName.empty(),
    Password.default()
  );

  public static of(
    account: AccountName,
    password: Password
  ): EntranceInformation {
    if (account.isEmpty()) {
      if (password.isDefault()) {
        return EntranceInformation.empty();
      }
    }

    return new EntranceInformation(account, password);
  }

  public static empty(): EntranceInformation {
    return EntranceInformation.EMPTY;
  }

  protected constructor(
    account: AccountName,
    password: Password
  ) {
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
    if (this.account.isEmpty()) {
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

import { JSONable, ValueObject } from 'publikum';
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
    Password.empty()
  );

  public static of(
    account: AccountName,
    password: Password
  ): EntranceInformation {
    if (account.isEmpty()) {
      if (password.isEmpty()) {
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
    if (this.password.isEmpty()) {
      return false;
    }

    return true;
  }

  public equals(other: EntranceInformation): boolean {
    if (this === other) {
      return true;
    }
    if (!this.account.equals(other.account)) {
      return false;
    }
    if (!this.password.equals(other.password)) {
      return false;
    }

    return true;
  }

  public toJSON(): EntranceInformationJSON {
    return {
      account: this.account.get(),
      password: this.password.get()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.account.toString());
    properties.push(this.password.toString());

    return properties.join(' ');
  }
}

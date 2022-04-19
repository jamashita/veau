import { ValueObject } from '@jamashita/anden-object';
import { JSONable } from '@jamashita/anden-type';
import { AccountName } from '../Account/AccountName.js';
import { Password } from './Password.js';

export type EntranceInformationJSON = Readonly<{
  account: string;
  password: string;
}>;

export class EntranceInformation extends ValueObject implements JSONable<EntranceInformationJSON> {
  private readonly account: AccountName;
  private readonly password: Password;

  private static readonly EMPTY: EntranceInformation = new EntranceInformation(AccountName.empty(), Password.empty());

  public static empty(): EntranceInformation {
    return EntranceInformation.EMPTY;
  }

  public static of(account: AccountName, password: Password): EntranceInformation {
    if (account.isEmpty()) {
      if (password.isEmpty()) {
        return EntranceInformation.empty();
      }
    }

    return new EntranceInformation(account, password);
  }

  // TODO TEST
  public static ofJSON(json: EntranceInformationJSON): EntranceInformation {
    return EntranceInformation.of(
      AccountName.of(json.account),
      Password.of(json.password)
    );
  }

  protected constructor(account: AccountName, password: Password) {
    super();
    this.account = account;
    this.password = password;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof EntranceInformation)) {
      return false;
    }
    if (!this.account.equals(other.account)) {
      return false;
    }
    if (!this.password.equals(other.password)) {
      return false;
    }

    return true;
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

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.account.toString());
    properties.push(this.password.toString());

    return properties.join(', ');
  }

  public toJSON(): EntranceInformationJSON {
    return {
      account: this.account.get(),
      password: this.password.get()
    };
  }
}

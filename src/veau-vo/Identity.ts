import {IdentityID} from './IdentityID';
import {ValueObject} from './ValueObject';

export type IdentityJSON = {
  id: number;
  account: string;
  language: string;
  locale: string;
};

export class Identity extends ValueObject {
  private identityID: IdentityID;
  private account: string;
  private language: string;
  private locale: string;

  public static default(): Identity {
    return new Identity(IdentityID.default(), '', '', '');
  }

  public static of(identityID: IdentityID, account: string, language: string, locale: string): Identity {
    return new Identity(identityID, account, language, locale);
  }

  private constructor(identityID: IdentityID, account: string, language: string, locale: string) {
    super();
    this.identityID = identityID;
    this.account = account;
    this.language = language;
    this.locale = locale;
  }

  public getIdentityID(): IdentityID {
    return this.identityID;
  }

  public getAccount(): string {
    return this.account;
  }

  public getLanguage(): string {
    return this.language;
  }

  public getLocale(): string {
    return this.locale;
  }

  public isDefault(): boolean {
    if (this.getIdentityID().equals(IdentityID.default())) {
      return true;
    }

    return false;
  }

  public equals(other: Identity): boolean {
    if (this === other) {
      return true;
    }
    if (this.getIdentityID().equals(other.getIdentityID())) {
      return true;
    }

    return false;
  }

  public toJSON(): IdentityJSON {
    const {
      identityID,
      account,
      language,
      locale
    } = this;

    return {
      id: identityID.get(),
      account,
      language,
      locale
    };
  }

  public toString(): string {
    const {
      identityID,
      account,
      language,
      locale
    } = this;

    return `${identityID.toString()} ${account} ${language} ${locale}`;
  }
}

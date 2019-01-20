import {IdentityID} from '../veau-vo/IdentityID';
import {Entity} from './Entity';

export type IdentityJSON = {
  id: number;
  account: string;
  language: string;
  locale: string;
};

export class Identity extends Entity<IdentityID> {
  private identityID: IdentityID;
  private account: string;
  private language: string;
  private locale: string;

  public static default(): Identity {
    return new Identity(IdentityID.of(0), '', '', '');
  }

  public constructor(identityID: IdentityID, account: string, language: string, locale: string) {
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

  public getIdentifier(): IdentityID {
    return this.identityID;
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

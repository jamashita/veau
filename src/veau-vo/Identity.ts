import { IdentityID } from './IdentityID';
import { ValueObject } from './ValueObject';

export type IdentityJSON = {
  id: number;
  account: string;
  language: string;
  region: string;
};

export class Identity extends ValueObject {
  private identityID: IdentityID;
  private account: string;
  private language: string;
  private region: string;

  public static default(): Identity {
    return new Identity(IdentityID.default(), '', 'en', '');
  }

  public static of(identityID: IdentityID, account: string, language: string, region: string): Identity {
    return new Identity(identityID, account, language, region);
  }

  private constructor(identityID: IdentityID, account: string, language: string, region: string) {
    super();
    this.identityID = identityID;
    this.account = account;
    this.language = language;
    this.region = region;
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

  public getRegion(): string {
    return this.region;
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
    if (!this.getIdentityID().equals(other.getIdentityID())) {
      return false;
    }
    if (this.account !== other.getAccount()) {
      return false;
    }
    if (this.language !== other.getLanguage()) {
      return false;
    }
    if (this.region !== other.getRegion()) {
      return false;
    }

    return true;
  }

  public toJSON(): IdentityJSON {
    const {
      identityID,
      account,
      language,
      region
    } = this;

    return {
      id: identityID.get(),
      account,
      language,
      region
    };
  }

  public toString(): string {
    const {
      identityID,
      account,
      language,
      region
    } = this;

    return `${identityID.toString()} ${account} ${language} ${region}`;
  }
}

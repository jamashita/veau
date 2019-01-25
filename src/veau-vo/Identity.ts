import { IdentityID } from './IdentityID';
import { ISO3166 } from './ISO3166';
import { ISO639 } from './ISO639';
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
  private language: ISO639;
  private region: ISO3166;

  public static default(): Identity {
    return new Identity(IdentityID.default(), '', ISO639.defualt(), ISO3166.default());
  }

  public static of(identityID: IdentityID, account: string, language: ISO639, region: ISO3166): Identity {
    return new Identity(identityID, account, language, region);
  }

  private constructor(identityID: IdentityID, account: string, language: ISO639, region: ISO3166) {
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

  public getLanguage(): ISO639 {
    return this.language;
  }

  public getRegion(): ISO3166 {
    return this.region;
  }

  public isDefault(): boolean {
    if (this.getIdentityID().equals(IdentityID.default())) {
      return true;
    }

    return false;
  }

  public copy(): Identity {
    const {
      identityID,
      account,
      language,
      region
    } = this;

    return new Identity(identityID.copy(), account, language.copy(), region.copy());
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
    if (!this.language.equals(other.getLanguage())) {
      return false;
    }
    if (!this.region.equals(other.getRegion())) {
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
      language: language.get(),
      region: region.get()
    };
  }

  public toString(): string {
    const {
      identityID,
      account,
      language,
      region
    } = this;

    return `${identityID.toString()} ${account} ${language.toString()} ${region.toString()}`;
  }
}

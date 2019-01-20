import {Identity, IdentityJSON} from '../veau-entity/Identity';
import {IdentityID} from '../veau-vo/IdentityID';

export class IdentityFactory {
  private static instance: IdentityFactory = new IdentityFactory();

  public static getInstance(): IdentityFactory {
    return IdentityFactory.instance;
  }

  private constructor() {
  }

  public from(identityID: IdentityID, account: string, language: string, locale: string): Identity {
    return new Identity(identityID, account, language, locale);
  }

  public fromJSON(json: IdentityJSON): Identity {
    const {
      id,
      account,
      language,
      locale
    } = json;

    return this.from(IdentityID.of(id), account, language, locale);
  }

  public initialize(identity: Identity): Identity {
    return this.from(IdentityID.of(0), '', identity.getLanguage(), identity.getLocale());
  }
}

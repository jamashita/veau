/* tslint:disable */
import 'jest';
import { Identity, IdentityJSON } from '../../veau-entity/Identity';
import {  IdentityID } from '../../veau-vo/IdentityID';
import { IdentityFactory } from '../IdentityFactory';

describe('IdentityFactory', () => {
  it('from', () => {
    const identityID: IdentityID = IdentityID.of(1);
    const account: string = 'account';
    const language: string = 'lang';
    const locale: string = 'locl';

    const identityFactory: IdentityFactory = IdentityFactory.getInstance();
    const identity: Identity = identityFactory.from(identityID, account, language, locale);

    expect(identity.getIdentityID().equals(identityID)).toEqual(true);
    expect(identity.getAccount()).toEqual(account);
    expect(identity.getLanguage()).toEqual(language);
    expect(identity.getLocale()).toEqual(locale);
  });

  it('fromJSON', () => {
    const json: IdentityJSON = {
      id: 1,
      account: 'account',
      language: 'lang',
      locale: 'locl'
    };

    const identityFactory: IdentityFactory = IdentityFactory.getInstance();
    const identity: Identity = identityFactory.fromJSON(json);

    expect(identity.getIdentityID().get()).toEqual(json.id);
    expect(identity.getAccount()).toEqual(json.account);
    expect(identity.getLanguage()).toEqual(json.language);
    expect(identity.getLocale()).toEqual(json.locale);
  });

  it('initialize', () => {
    const identity: Identity = new Identity(IdentityID.of(1), 'account', 'lang', 'locl');

    const identityFactory: IdentityFactory = IdentityFactory.getInstance();
    const newIdentity: Identity = identityFactory.initialize(identity);

    expect(newIdentity.getIdentityID().equals(identity.getIdentityID())).toEqual(false);
    expect(newIdentity.getAccount()).not.toEqual(identity.getAccount());
    expect(newIdentity.getLanguage()).toEqual(identity.getLanguage());
    expect(newIdentity.getLocale()).toEqual(identity.getLocale());
  });
});

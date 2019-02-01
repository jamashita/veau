/* tslint:disable */
import 'jest';
import { IdentityID } from '../IdentityID';
import { Identity } from '../Identity';
import { ISO3166 } from '../ISO3166';
import { ISO639 } from '../ISO639';
import { UUID } from '../UUID';

describe('Identity', () => {
  it('equals', () => {
    const identity1: Identity = Identity.of(IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'account1', ISO639.of('lang1'), ISO3166.of('regn1'));
    const identity2: Identity = Identity.of(IdentityID.of(UUID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9')), 'account1', ISO639.of('lang1'), ISO3166.of('regn1'));
    const identity3: Identity = Identity.of(IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'account2', ISO639.of('lang1'), ISO3166.of('regn1'));
    const identity4: Identity = Identity.of(IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'account1', ISO639.of('lang2'), ISO3166.of('regn1'));
    const identity5: Identity = Identity.of(IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'account1', ISO639.of('lang1'), ISO3166.of('regn2'));
    const identity6: Identity = Identity.of(IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'account1', ISO639.of('lang1'), ISO3166.of('regn1'));

    expect(identity1.equals(identity1)).toEqual(true);
    expect(identity1.equals(identity2)).toEqual(false);
    expect(identity1.equals(identity3)).toEqual(false);
    expect(identity1.equals(identity4)).toEqual(false);
    expect(identity1.equals(identity5)).toEqual(false);
    expect(identity1.equals(identity6)).toEqual(true);
  });

  it('toJSON', () => {
    const identity: Identity = Identity.of(IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'account', ISO639.of('lang'), ISO3166.of('regn'));

    expect(identity.toJSON()).toEqual({
      id: '998106de-b2e7-4981-9643-22cd30cd74de',
      account: 'account',
      language: 'lang',
      region: 'regn'
    });
  });

  it('isDefault', () => {
    const identity1: Identity = Identity.of(IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 'account', ISO639.of('lang'), ISO3166.of('regn'));
    const identity2: Identity = Identity.default();

    expect(identity1.isDefault()).toEqual(false);
    expect(identity2.isDefault()).toEqual(true);
  });
});

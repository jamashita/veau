/* tslint:disable */
import 'jest';
import { IdentityID } from '../IdentityID';
import { Identity } from '../Identity';

describe('Identity', () => {
  it('equals', () => {
    const identity1: Identity = Identity.of(IdentityID.of(1), 'account1', 'lang1', 'regn1');
    const identity2: Identity = Identity.of(IdentityID.of(2), 'account1', 'lang1', 'regn1');
    const identity3: Identity = Identity.of(IdentityID.of(1), 'account2', 'lang1', 'regn1');
    const identity4: Identity = Identity.of(IdentityID.of(1), 'account1', 'lang2', 'regn1');
    const identity5: Identity = Identity.of(IdentityID.of(1), 'account1', 'lang1', 'regn2');
    const identity6: Identity = Identity.of(IdentityID.of(1), 'account1', 'lang1', 'regn1');

    expect(identity1.equals(identity1)).toEqual(true);
    expect(identity1.equals(identity2)).toEqual(false);
    expect(identity1.equals(identity3)).toEqual(false);
    expect(identity1.equals(identity4)).toEqual(false);
    expect(identity1.equals(identity5)).toEqual(false);
    expect(identity1.equals(identity6)).toEqual(true);
  });

  it('toJSON', () => {
    const identity: Identity = Identity.of(IdentityID.of(1), 'account', 'lang', 'regn');

    expect(identity.toJSON()).toEqual({
      id: 1,
      account: 'account',
      language: 'lang',
      region: 'regn'
    });
  });

  it('isDefault', () => {
    const identity1: Identity = Identity.of(IdentityID.of(1), 'account', 'lang', 'regn');
    const identity2: Identity = Identity.default();

    expect(identity1.isDefault()).toEqual(false);
    expect(identity2.isDefault()).toEqual(true);
  });
});

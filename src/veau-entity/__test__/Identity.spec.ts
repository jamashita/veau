/* tslint:disable */
import 'jest';
import { IdentityID } from '../../veau-vo/IdentityID';
import { Identity } from '../Identity';

describe('Identity', () => {
  it('equals', () => {
    const identity1: Identity = new Identity(IdentityID.of(1), 'account1', 'lang1', 'locl1');
    const identity2: Identity = new Identity(IdentityID.of(2), 'account1', 'lang1', 'locl1');
    const identity3: Identity = new Identity(IdentityID.of(1), 'account2', 'lang2', 'locl2');

    expect(identity1.equals(identity1)).toEqual(true);
    expect(identity1.equals(identity2)).toEqual(false);
    expect(identity1.equals(identity3)).toEqual(true);
  });

  it('toJSON', () => {
    const identity: Identity = new Identity(IdentityID.of(1), 'account', 'lang', 'locl');

    expect(identity.toJSON()).toEqual({
      id: 1,
      account: 'account',
      language: 'lang',
      locale: 'locl'
    });
  });
});

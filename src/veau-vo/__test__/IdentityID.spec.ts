/* tslint:disable */
import 'jest';
import { IdentityID } from '../IdentityID';
import { UUID } from '../UUID';

describe('IdentityID', () => {
  it('equals', () => {
    const identityID1: IdentityID = IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de'));
    const identityID2: IdentityID = IdentityID.of(UUID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9'));
    const identityID3: IdentityID = IdentityID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de'));

    expect(identityID1.equals(identityID1)).toEqual(true);
    expect(identityID1.equals(identityID2)).toEqual(false);
    expect(identityID1.equals(identityID3)).toEqual(true);
  });
});

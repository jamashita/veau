/* tslint:disable */
import 'jest';
import { IdentityID } from '../IdentityID';

describe('IdentityID', () => {
  it('equals', () => {
    const identityID1: IdentityID = IdentityID.of(1);
    const identityID2: IdentityID = IdentityID.of(2);
    const identityID3: IdentityID = IdentityID.of(1);

    expect(identityID1.equals(identityID1)).toEqual(true);
    expect(identityID1.equals(identityID2)).toEqual(false);
    expect(identityID1.equals(identityID3)).toEqual(true);
  });
});

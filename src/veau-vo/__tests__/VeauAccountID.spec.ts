import 'jest';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccountID', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const account1: VeauAccountID = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');
      const account2: VeauAccountID = VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9');
      const account3: VeauAccountID = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(account1.equals(account1)).toEqual(true);
      expect(account1.equals(account2)).toEqual(false);
      expect(account1.equals(account3)).toEqual(true);
    });
  });
});

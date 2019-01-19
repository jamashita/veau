import 'jest';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccountID', () => {
  it('equals', () => {
    const account1: VeauAccountID = VeauAccountID.of(1);
    const account2: VeauAccountID = VeauAccountID.of(2);
    const account3: VeauAccountID = VeauAccountID.of(1);

    expect(account1.equals(account1)).toEqual(true);
    expect(account1.equals(account2)).toEqual(false);
    expect(account1.equals(account3)).toEqual(true);
  });
});

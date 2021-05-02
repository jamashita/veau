import { MockVeauAccount } from '../../VeauAccount/Mock/MockVeauAccount';
import { Account } from '../Account';
import { Hash } from '../Hash';

type AccountArgs = Partial<Readonly<{
  account: MockVeauAccount;
  hash: Hash;
}>>;

export class MockAccount extends Account {
  public constructor({ account = new MockVeauAccount(), hash = Hash.of('') }: AccountArgs = {}) {
    super(account, hash);
  }
}

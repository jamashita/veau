import { MockVeauAccount } from '../../VeauAccount/Mock/MockVeauAccount';
import { Account } from '../Account';
import { Hash } from '../Hash';
import { MockHash } from './MockHash';

type AccountArgs = Partial<Readonly<{
  account: MockVeauAccount;
  hash: Hash;
}>>;

export class MockAccount extends Account {
  public constructor({ account = new MockVeauAccount(), hash = new MockHash() }: AccountArgs = {}) {
    super(account, hash);
  }
}

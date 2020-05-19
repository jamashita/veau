import { Account } from '../Account';
import { Hash } from '../Hash';
import { MockHash } from './MockHash';
import { MockVeauAccount } from '../../VeauAccount/Mock/MockVeauAccount';

type AccountArgs = Partial<
  Readonly<{
    account: MockVeauAccount;
    hash: Hash;
  }>
>;

export class MockAccount extends Account {
  public constructor({ account = new MockVeauAccount(), hash = new MockHash() }: AccountArgs = {}) {
    super(account, hash);
  }
}

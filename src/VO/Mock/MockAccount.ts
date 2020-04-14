import { Account } from '../Account';
import { AccountName } from '../AccountName';
import { Hash } from '../Hash';
import { Language } from '../Language';
import { Region } from '../Region';
import { VeauAccountID } from '../VeauAccountID';
import { MockAccountName } from './MockAccountName';
import { MockHash } from './MockHash';
import { MockLanguage } from './MockLanguage';
import { MockRegion } from './MockRegion';
import { MockVeauAccountID } from './MockVeauAccountID';

type AccountArgs = Partial<Readonly<{
  veauAccountID: VeauAccountID;
  account: AccountName;
  language: Language;
  region: Region;
  hash: Hash;
}>>;

export class MockAccount extends Account {

  public constructor({
    veauAccountID = new MockVeauAccountID(),
    account = new MockAccountName(),
    language = new MockLanguage(),
    region = new MockRegion(),
    hash = new MockHash()
  }: AccountArgs = {}) {
    super(
      veauAccountID,
      account,
      language,
      region,
      hash
    );
  }
}

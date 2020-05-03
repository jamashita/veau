import { Account } from '../Account';
import { AccountName } from '../AccountName';
import { Hash } from '../Hash';
import { LanguageID } from '../LanguageID';
import { RegionID } from '../RegionID';
import { VeauAccountID } from '../VeauAccountID';
import { MockAccountName } from './MockAccountName';
import { MockHash } from './MockHash';
import { MockLanguageID } from './MockLanguageID';
import { MockRegionID } from './MockRegionID';
import { MockVeauAccountID } from './MockVeauAccountID';

type AccountArgs = Partial<Readonly<{
  veauAccountID: VeauAccountID;
  languageID: LanguageID;
  regionID: RegionID;
  account: AccountName;
  hash: Hash;
}>>;

export class MockAccount extends Account {

  public constructor({
    veauAccountID = new MockVeauAccountID(),
    languageID = new MockLanguageID(),
    regionID = new MockRegionID(),
    account = new MockAccountName(),
    hash = new MockHash()
  }: AccountArgs = {}) {
    super(
      veauAccountID,
      languageID,
      regionID,
      account,
      hash
    );
  }
}

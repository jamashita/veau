import { AccountName } from '../AccountName';
import { LanguageID } from '../LanguageID';
import { RegionID } from '../RegionID';
import { VeauAccount } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';
import { MockAccountName } from './MockAccountName';
import { MockLanguageID } from './MockLanguageID';
import { MockRegionID } from './MockRegionID';
import { MockVeauAccountID } from './MockVeauAccountID';

type VeauAccountArgs = Partial<Readonly<{
  veauAccountID: VeauAccountID;
  account: AccountName;
  languageID: LanguageID;
  regionID: RegionID;
}>>;

export class MockVeauAccount extends VeauAccount {

  public constructor({
    veauAccountID = new MockVeauAccountID(),
    account = new MockAccountName(),
    languageID = new MockLanguageID(),
    regionID = new MockRegionID()
  }: VeauAccountArgs = {}) {
    super(veauAccountID, account, languageID, regionID);
  }
}

import { AccountName } from '../AccountName';
import { LanguageID } from '../LanguageID';
import { RegionID } from '../RegionID';
import { VeauAccount } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';
import { MockAccountName } from './MockAccountName';
import { MockLanguageID } from './MockLanguageID';
import { MockRegionID } from './MockRegionID';
import { MockVeauAccountID } from './MockVeauAccountID';

type VeauAccountArgs = Partial<
  Readonly<{
    veauAccountID: VeauAccountID;
    languageID: LanguageID;
    regionID: RegionID;
    account: AccountName;
  }>
>;

export class MockVeauAccount extends VeauAccount {
  public constructor({
    veauAccountID = new MockVeauAccountID(),
    languageID = new MockLanguageID(),
    regionID = new MockRegionID(),
    account = new MockAccountName()
  }: VeauAccountArgs = {}) {
    super(veauAccountID, languageID, regionID, account);
  }
}

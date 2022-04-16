import { AccountName } from '../../Account/AccountName';
import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/mock/MockLanguageID';
import { MockRegionID } from '../../Region/mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { VeauAccount } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';
import { MockVeauAccountID } from './MockVeauAccountID';

type VeauAccountArgs = Partial<Readonly<{
  veauAccountID: VeauAccountID;
  languageID: LanguageID;
  regionID: RegionID;
  account: AccountName;
}>>;

export class MockVeauAccount extends VeauAccount {
  public constructor({
    veauAccountID = new MockVeauAccountID(),
    languageID = new MockLanguageID(),
    regionID = new MockRegionID(),
    account = AccountName.empty()
  }: VeauAccountArgs = {}) {
    super(veauAccountID, languageID, regionID, account);
  }
}

import { UUID } from '@jamashita/anden-uuid';
import { AccountName } from '../../Account/AccountName';
import { LanguageID } from '../../Language/LanguageID';
import { RegionID } from '../../Region/RegionID';
import { VeauAccount } from '../VeauAccount';
import { VeauAccountID } from '../VeauAccountID';

type VeauAccountArgs = Partial<Readonly<{
  veauAccountID: VeauAccountID;
  languageID: LanguageID;
  regionID: RegionID;
  account: AccountName;
}>>;

export class MockVeauAccount extends VeauAccount {
  public constructor({
    veauAccountID = VeauAccountID.of(UUID.v4()),
    languageID = LanguageID.of(UUID.v4()),
    regionID = RegionID.of(UUID.v4()),
    account = AccountName.empty()
  }: VeauAccountArgs = {}) {
    super(veauAccountID, languageID, regionID, account);
  }
}

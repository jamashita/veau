import { AccountName } from '../../Account/AccountName';
import { Language } from '../../Language/Language';
import { MockLanguage } from '../../Language/mock/MockLanguage';
import { MockRegion } from '../../Region/mock/MockRegion';
import { Region } from '../../Region/Region';
import { MockVeauAccountID } from '../../VeauAccount/mock/MockVeauAccountID';
import { VeauAccountID } from '../../VeauAccount/VeauAccountID';
import { Identity } from '../Identity';

type VeauAccountArgs = Partial<Readonly<{
  veauAccountID: VeauAccountID;
  account: AccountName;
  language: Language;
  region: Region;
}>>;

export class MockIdentity extends Identity {
  public constructor({
    veauAccountID = new MockVeauAccountID(),
    account = AccountName.empty(),
    language = new MockLanguage(),
    region = new MockRegion()
  }: VeauAccountArgs = {}) {
    super(veauAccountID, account, language, region);
  }
}

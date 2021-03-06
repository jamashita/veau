import { AccountName } from '../../Account/AccountName';
import { MockAccountName } from '../../Account/Mock/MockAccountName';
import { Language } from '../../Language/Language';
import { MockLanguage } from '../../Language/Mock/MockLanguage';
import { MockRegion } from '../../Region/Mock/MockRegion';
import { Region } from '../../Region/Region';
import { MockVeauAccountID } from '../../VeauAccount/Mock/MockVeauAccountID';
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
    account = new MockAccountName(),
    language = new MockLanguage(),
    region = new MockRegion()
  }: VeauAccountArgs = {}) {
    super(veauAccountID, account, language, region);
  }
}

import { AccountName } from '../AccountName';
import { Identity } from '../Identity';
import { Language } from '../Language';
import { Region } from '../Region';
import { VeauAccountID } from '../VeauAccountID';
import { MockAccountName } from './MockAccountName';
import { MockLanguage } from './MockLanguage';
import { MockRegion } from './MockRegion';
import { MockVeauAccountID } from './MockVeauAccountID';

type VeauAccountArgs = Partial<
  Readonly<{
    veauAccountID: VeauAccountID;
    account: AccountName;
    language: Language;
    region: Region;
  }>
>;

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

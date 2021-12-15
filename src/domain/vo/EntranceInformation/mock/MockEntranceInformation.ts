import { AccountName } from '../../Account/AccountName';
import { EntranceInformation } from '../EntranceInformation';
import { Password } from '../Password';
import { MockPassword } from './MockPassword';

type EntranceInformationArgs = Partial<Readonly<{
  account: AccountName;
  password: Password;
}>>;

export class MockEntranceInformation extends EntranceInformation {
  public constructor({ account = AccountName.empty(), password = new MockPassword() }: EntranceInformationArgs = {}) {
    super(account, password);
  }
}

import { AccountName } from '../AccountName';
import { EntranceInformation } from '../EntranceInformation';
import { Password } from '../Password';
import { MockAccountName } from './MockAccountName';
import { MockPassword } from './MockPassword';

type EntranceInformationArgs = Partial<Readonly<{
  account: AccountName;
  password: Password;
}>>;

export class MockEntranceInformation extends EntranceInformation {

  public constructor({
    account = new MockAccountName(),
    password = new MockPassword()
  }: EntranceInformationArgs = {}) {
    super(account, password);
  }
}

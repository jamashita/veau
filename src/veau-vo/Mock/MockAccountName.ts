import { AccountName } from '../AccountName';

export class MockAccountName extends AccountName {

  public constructor(name: string = 'MOCK ACCOUNT NAME') {
    super(name);
  }
}

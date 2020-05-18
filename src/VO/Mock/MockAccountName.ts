import { AccountName } from '../AccountName';

export class MockAccountName extends AccountName {
  public constructor(name: string = '') {
    super(name);
  }
}

import { Password } from '../Password';

export class MockPassword extends Password {

  public constructor(password: string = '') {
    super(password);
  }
}

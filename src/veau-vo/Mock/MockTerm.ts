import { Term } from '../Term';

export class MockTerm extends Term {

  public constructor() {
    super(0, 'NEVER');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public equals(other: Term): boolean {
    return false;
  }
}

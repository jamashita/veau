import { Term } from '../Term';

export class MockTerm extends Term {

  public constructor(id: number = 0, key: string = 'NEVER') {
    super(id, key);
  }
}

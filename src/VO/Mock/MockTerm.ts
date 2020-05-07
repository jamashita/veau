import { Term } from '../Term';
import { TermID } from '../TermID';
import { TermKey } from '../TermKey';
import { MockTermID } from './MockTermID';
import { MockTermKey } from './MockTermKey';

type TermArgs = Partial<Readonly<{
  termID: TermID;
  key: TermKey;
}>>;

export class MockTerm extends Term {

  public constructor({
    termID = new MockTermID(),
    key = new MockTermKey()
  }: TermArgs = {}) {
    super(termID, key);
  }
}

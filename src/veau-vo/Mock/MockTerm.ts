import { Term } from '../Term';

type TermArgs = Partial<Readonly<{
  id: number;
  key: string;
}>>;

export class MockTerm extends Term {

  public constructor({
    id = 0,
    key = 'NEVER'
  }: TermArgs = {}) {
    super(id, key);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public equals(other: Term): boolean {
    if (other instanceof MockTerm) {
      if (this.getID() === other.getID()) {
        if (this.getKey() === other.getKey()) {
          return true;
        }
      }
      return false;
    }

    return false;
  }
}

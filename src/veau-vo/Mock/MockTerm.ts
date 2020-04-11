import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { Term } from '../Term';

export class MockTerm extends Term {

  public constructor() {
    super(0, 'NEVER');
  }

  public getID(): number {
    throw new UnimplementedError();
  }

  public getKey(): string {
    throw new UnimplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public equals(other: Term): boolean {
    throw new UnimplementedError();
  }

  public toString(): string {
    throw new UnimplementedError();
  }
}

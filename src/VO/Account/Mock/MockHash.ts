import { Hash } from '../Hash';

export class MockHash extends Hash {
  public constructor(hash: string = '') {
    super(hash);
  }
}

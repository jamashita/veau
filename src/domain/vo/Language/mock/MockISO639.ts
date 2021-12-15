import { ISO639 } from '../ISO639';

export class MockISO639 extends ISO639 {
  public constructor(iso639: string = '') {
    super(iso639);
  }
}

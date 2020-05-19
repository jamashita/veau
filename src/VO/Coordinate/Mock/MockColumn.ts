import { Column } from '../Column';

export class MockColumn extends Column {
  public constructor(column: number = 0) {
    super(column);
  }
}

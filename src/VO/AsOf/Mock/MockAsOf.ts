import { Zeit } from '@jamashita/publikum-zeit';

import { AsOf } from '../AsOf';

type AsOfArgs = Partial<
  Readonly<{
    year: number;
    month: number;
    day: number;
  }>
>;

export class MockAsOf extends AsOf {
  public constructor({ year = 2000, month = 1, day = 1 }: AsOfArgs = {}) {
    super(
      Zeit.ofString(
        `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        AsOf.format()
      )
    );
  }
}

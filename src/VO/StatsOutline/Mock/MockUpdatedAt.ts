import { Zeit } from '@jamashita/publikum-zeit';

import { UpdatedAt } from '../UpdatedAt';

type UpdatedAtArgs = Partial<
  Readonly<{
    year: number;
    month: number;
    day: number;
  }>
>;

export class MockUpdatedAt extends UpdatedAt {
  public constructor({ year = 2000, month = 1, day = 2 }: UpdatedAtArgs = {}) {
    super(
      Zeit.ofString(
        `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')} 01:02:03`,
        UpdatedAt.format()
      )
    );
  }
}

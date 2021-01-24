import { ImmutableSequence } from '@jamashita/publikum-collection';
import { NumericalValues } from '../NumericalValues';

import { ValueContained } from '../ValueContained';

export class MockNumericalValues extends NumericalValues {
  public constructor(...values: ReadonlyArray<ValueContained>) {
    super(ImmutableSequence.ofArray<ValueContained>(values));
  }
}

import { ImmutableSequence } from '@jamashita/publikum-collection';

import { NumericalValue } from '../NumericalValue';
import { NumericalValues } from '../NumericalValues';

export class MockNumericalValues extends NumericalValues {
  public constructor(...values: ReadonlyArray<NumericalValue>) {
    super(ImmutableSequence.of<NumericalValue>([...values]));
  }
}

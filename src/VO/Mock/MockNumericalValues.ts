import { ImmutableSequence } from '../../General/Collection/ImmutableSequence';
import { NumericalValue } from '../NumericalValue';
import { NumericalValues } from '../NumericalValues';

export class MockNumericalValues extends NumericalValues {

  public constructor(...values: Array<NumericalValue>) {
    super(ImmutableSequence.of<NumericalValue>(values));
  }
}

import { NumericalValues } from '../NumericalValues';
import { NumericalValue } from '../NumericalValue';
import { ImmutableSequence } from '../../General/Collection/ImmutableSequence';

export class MockNumericalValues extends NumericalValues {

  public constructor(...values: Array<NumericalValue>) {
    super(ImmutableSequence.of<NumericalValue>(values));
  }
}

import { NumericalValues } from '../NumericalValues';
import { NumericalValue } from '../NumericalValue';
import { Sequence } from '../../General/Collection/Sequence';

export class MockNumericalValues extends NumericalValues {

  public constructor(...values: Array<NumericalValue>) {
    super(Sequence.of<NumericalValue>(values));
  }
}

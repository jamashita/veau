import { NumericalValues } from '../NumericalValues';
import { NumericalValue } from '../NumericalValue';
import { MockSequence } from '../../veau-general/Collection/Mock/MockSequence';

export class MockNumericalValues extends NumericalValues {

  public constructor(...values: Array<NumericalValue>) {
    super(new MockSequence<NumericalValue>(values));
  }
}

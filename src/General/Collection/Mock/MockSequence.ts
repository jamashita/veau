import { Sequence } from '../Sequence';
import { Nominative } from '../../Interface/Nominative';

export class MockSequence<E extends Nominative> extends Sequence<E> {

  public constructor(elements: Array<E> = []) {
    super(elements);
  }
}

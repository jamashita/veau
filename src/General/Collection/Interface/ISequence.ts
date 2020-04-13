import { Nominative } from '../../Interface/Nominative';
import { List } from '../../Interface/List';

export interface ISequence<E extends Nominative> extends List<E> {
  readonly noun: 'Sequence';

  add(...elements: Array<E>): ThisType<E>;
}

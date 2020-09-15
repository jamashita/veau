import { Nominative } from '@jamashita/publikum-interface';

type NumericalValueType = 'NumericalValue' | 'NoValue';

export interface INumericalValue<N extends NumericalValueType = NumericalValueType> extends Nominative<INumericalValue<N>, N> {
  readonly noun: N;
}

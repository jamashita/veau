import { Nominative } from '@jamashita/publikum-interface';

type NumericalValueType = 'NoValue' | 'NumericalValue';

export interface INumericalValue<N extends NumericalValueType = NumericalValueType> extends Nominative<N> {
  readonly noun: N;
}

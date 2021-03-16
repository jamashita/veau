import { Nominative } from '@jamashita/publikum-interface';

type NumericalValueType = 'NoValue' | 'ValueContained';

export interface NumericalValue<N extends NumericalValueType = NumericalValueType> extends Nominative<N> {
  readonly noun: N;

  get(): number;
}

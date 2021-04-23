import { Noun } from '@jamashita/anden-type';

export interface IQuery<N extends string = string, S extends string = string> extends Noun<N> {
  readonly source: S;
}

import { Noun } from 'publikum';

export interface IQuery extends Noun {
  readonly source: string;
}

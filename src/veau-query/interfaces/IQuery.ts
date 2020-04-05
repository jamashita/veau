import { Noun } from '../../veau-general/Noun';

export interface IQuery extends Noun {
  readonly source: string;
}

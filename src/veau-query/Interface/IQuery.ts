import { Noun } from '../../veau-general/Interface/Noun';

export interface IQuery extends Noun {
  readonly source: string;
}

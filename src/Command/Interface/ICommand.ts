import { Noun } from '../../veau-general/Interface/Noun';

export interface ICommand extends Noun {
  readonly source: string;
}

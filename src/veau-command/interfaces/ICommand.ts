import { Noun } from '../../veau-general/Noun';

export interface ICommand extends Noun {
  readonly source: string;
}

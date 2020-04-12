import { Noun } from '../../General/Interface/Noun';

export interface ICommand extends Noun {
  readonly source: string;
}

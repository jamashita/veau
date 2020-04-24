import { Noun } from 'publikum';

export interface ICommand extends Noun {
  readonly source: string;
}

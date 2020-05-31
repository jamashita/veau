import { Noun } from '@jamashita/publikum-interface';

export interface ICommand extends Noun {
  readonly source: string;
}

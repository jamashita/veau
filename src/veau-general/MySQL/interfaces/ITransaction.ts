import { Noun } from '../../Noun';
import { IQuery } from './IQuery';

export interface ITransaction extends Noun {

  with(query: IQuery): Promise<unknown>;
}

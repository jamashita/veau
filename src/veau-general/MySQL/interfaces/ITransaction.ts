import { Noun } from '../../Noun';
import { IQuery } from './IQuery';

export interface ITransaction<R> extends Noun {

  with(query: IQuery): Promise<R>;
}

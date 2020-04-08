import { JSObjectNotation } from '../../Type/Value';

export interface IQuery {

  execute<R>(sql: string, value?: JSObjectNotation): Promise<R>;
}

import { JSObjectNotation } from '../../Type/Value';

export interface IQuery {

  execute<T>(sql: string, value?: JSObjectNotation): Promise<T>;
}

import { JSObjectNotation } from '../../Type/Value';

export interface ISQL {

  execute<R>(sql: string, value?: JSObjectNotation): Promise<R>;
}

import { Mapper } from './Type/Mapper';

export interface Projectable<T> {

  map<U>(mapper: Mapper<T, U>): Array<U>;
}

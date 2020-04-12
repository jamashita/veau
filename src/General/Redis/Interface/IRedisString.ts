import { Nullable } from '../../Type/Value';

export interface IRedisString {

  set(key: string, value: string): Promise<boolean>;

  get(key: string): Promise<Nullable<string>>;
}

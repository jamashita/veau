import { Nullable } from '../../Type/Value';

export interface IRedisHash {

  set(key: string, field: string, value: string): Promise<boolean>;

  get(key: string, field: string): Promise<Nullable<string>>;

  delete(key: string, field: string): Promise<number>;

  length(key: string): Promise<number>;

  has(key: string, field: string): Promise<boolean>;
}

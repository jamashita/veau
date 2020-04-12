import { Nullable } from '../../Type/Value';

export interface IRedisSet {

  add(key: string, ...values: Array<string>): Promise<number>;

  remove(key: string, ...values: Array<string>): Promise<number>;

  has(key: string, value: string): Promise<boolean>;

  length(key: string): Promise<number>;

  dump(key: string): Promise<Array<string>>;

  random(key: string): Promise<Nullable<string>>;

  pop(key: string): Promise<Nullable<string>>;
}

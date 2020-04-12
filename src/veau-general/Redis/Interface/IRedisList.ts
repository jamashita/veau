export interface IRedisList {

  push(key: string, value: string): Promise<number>;

  pop(key: string): Promise<string>;

  shift(key: string): Promise<string>;

  length(key: string): Promise<number>;

  remove(key: string, value: string): Promise<number>;

  select(key: string, offset: number, limit: number): Promise<Array<string>>;

  dump(key: string): Promise<Array<string>>;
}

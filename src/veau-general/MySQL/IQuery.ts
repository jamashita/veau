export interface IQuery {

  execute<T>(sql: string, value?: object): Promise<T>;
}

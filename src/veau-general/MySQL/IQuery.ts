export interface IQuery {

  execute(sql: string, value?: object): Promise<any>;
}

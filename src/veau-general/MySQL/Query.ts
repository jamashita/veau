export interface Query {

  execute(sql: string, value?: object): Promise<any>;
}


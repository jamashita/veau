import { IQuery } from './IQuery';

export interface IConnection extends IQuery {

  commit(): Promise<void>;

  rollback(): Promise<void>;

  release(): void;
}

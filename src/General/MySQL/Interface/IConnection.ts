import { ISQL } from './ISQL';

export interface IConnection extends ISQL {

  commit(): Promise<void>;

  rollback(): Promise<void>;

  release(): void;
}

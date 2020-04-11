import { IQuery } from './IQuery';

export interface IVaultQuery extends IQuery {
  readonly source: 'Vault';
}

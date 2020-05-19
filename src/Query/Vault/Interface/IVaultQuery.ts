import { IQuery } from '../../Interface/IQuery';

export interface IVaultQuery extends IQuery {
  readonly source: 'Vault';
}

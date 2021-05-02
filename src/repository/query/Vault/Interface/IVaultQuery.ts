import { IQuery } from '../../Interface/IQuery';

export interface IVaultQuery extends IQuery<string, 'Vault'> {
  readonly source: 'Vault';
}

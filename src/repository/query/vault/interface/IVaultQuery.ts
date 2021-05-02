import { IQuery } from '../../interface/IQuery';

export interface IVaultQuery extends IQuery<string, 'Vault'> {
  readonly source: 'Vault';
}

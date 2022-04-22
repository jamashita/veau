import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';
import { Account } from './Account';
import { AccountError } from './AccountError';
import { AccountName } from './AccountName';

export interface AccountRepository<E extends DataSourceError = DataSourceError> {
  findByName(name: AccountName): Promise<Schrodinger<Account, AccountError | E | NoSuchElementError>>;
}

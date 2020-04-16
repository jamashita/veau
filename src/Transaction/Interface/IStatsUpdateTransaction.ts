import { DataSourceError } from '../../General/DataSourceError';
import { ITransaction } from '../../General/MySQL/Interface/ITransaction';
import { Superposition } from '../../General/Superposition/Superposition';

export interface IStatsUpdateTransaction extends ITransaction<Superposition<unknown, DataSourceError>> {
  readonly noun: 'StatsUpdateTransaction';
}

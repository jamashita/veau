import { DataSourceError, ITransaction, Superposition } from 'publikum';

export interface IStatsUpdateTransaction extends ITransaction<Superposition<unknown, DataSourceError>> {
  readonly noun: 'StatsUpdateTransaction';
}

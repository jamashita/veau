import { DataSourceError } from '../../General/DataSourceError';
import { ITransaction } from '../../General/MySQL/Interface/ITransaction';
import { Try } from '../../General/Try/Try';

export interface IStatsUpdateTransaction extends ITransaction<Try<unknown, DataSourceError>> {
  readonly noun: 'StatsUpdateTransaction';
}

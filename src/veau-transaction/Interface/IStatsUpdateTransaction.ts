import { DataSourceError } from '../../veau-general/DataSourceError';
import { ITransaction } from '../../veau-general/MySQL/Interface/ITransaction';
import { Try } from '../../veau-general/Try/Try';

export interface IStatsUpdateTransaction extends ITransaction<Try<unknown, DataSourceError>>{
  readonly noun: 'StatsUpdateTransaction';
}

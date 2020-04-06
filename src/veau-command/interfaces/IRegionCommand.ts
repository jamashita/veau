import { CacheError } from '../../veau-error/CacheError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { Regions } from '../../veau-vo/Regions';
import { ICommand } from './ICommand';

export interface IRegionCommand extends ICommand {
  readonly noun: 'RegionCommand';

  insertAll(regions: Regions): Promise<Try<void, DataSourceError>>;

  deleteAll(): Promise<Try<void, CacheError | DataSourceError>>;
}

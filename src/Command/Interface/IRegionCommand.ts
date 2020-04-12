import { CacheError } from '../../Error/CacheError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { Regions } from '../../VO/Regions';
import { ICommand } from './ICommand';

export interface IRegionCommand extends ICommand {
  readonly noun: 'RegionCommand';

  insertAll(regions: Regions): Promise<Try<void, DataSourceError>>;

  deleteAll(): Promise<Try<void, CacheError | DataSourceError>>;
}

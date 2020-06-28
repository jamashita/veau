import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Regions } from '../../VO/Region/Regions';
import { ICommand } from './ICommand';

export interface IRegionCommand extends ICommand {
  readonly noun: 'RegionCommand';

  insertAll(regions: Regions): Superposition<unknown, DataSourceError>;

  deleteAll(): Superposition<unknown, DataSourceError>;
}

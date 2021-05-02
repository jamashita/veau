import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { Regions } from '../../VO/Region/Regions';
import { ICommand } from './ICommand';

export interface IRegionCommand<E extends DataSourceError = DataSourceError> extends ICommand<'RegionCommand'> {
  readonly noun: 'RegionCommand';

  deleteAll(): Superposition<unknown, E>;

  insertAll(regions: Regions): Superposition<unknown, E>;
}

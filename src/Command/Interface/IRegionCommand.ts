import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';

import { Regions } from '../../VO/Region/Regions';
import { ICommand } from './ICommand';

export interface IRegionCommand<E extends DataSourceError = DataSourceError> extends ICommand<'RegionCommand'> {
  readonly noun: 'RegionCommand';

  insertAll(regions: Regions): Superposition<unknown, E>;

  deleteAll(): Superposition<unknown, E>;
}

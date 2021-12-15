import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Regions } from '../../domain/vo/Region/Regions.js';
import { ICommand } from './ICommand.js';

export interface IRegionCommand<E extends DataSourceError = DataSourceError> extends ICommand<'RegionCommand'> {
  readonly noun: 'RegionCommand';

  deleteAll(): Superposition<unknown, E>;

  insertAll(regions: Regions): Superposition<unknown, E>;
}

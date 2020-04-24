import { DataSourceError, Superposition } from 'publikum';
import { Regions } from '../../VO/Regions';
import { ICommand } from './ICommand';

export interface IRegionCommand extends ICommand {
  readonly noun: 'RegionCommand';

  insertAll(regions: Regions): Promise<Superposition<void, DataSourceError>>;

  deleteAll(): Promise<Superposition<void, DataSourceError>>;
}

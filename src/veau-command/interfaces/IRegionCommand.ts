import { CacheError } from '../../veau-error/CacheError';
import { Try } from '../../veau-general/Try/Try';
import { Regions } from '../../veau-vo/Regions';
import { ICommand } from './ICommand';

export interface IRegionCommand extends ICommand {
  readonly noun: 'RegionCommand';

  insertAll(regions: Regions): Promise<unknown>;

  deleteAll(): Promise<Try<void, CacheError>>;
}

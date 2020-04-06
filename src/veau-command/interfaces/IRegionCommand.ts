import { CacheError } from '../../veau-error/CacheError';
import { SourceError } from '../../veau-general/SourceError';
import { Try } from '../../veau-general/Try/Try';
import { Regions } from '../../veau-vo/Regions';
import { ICommand } from './ICommand';

export interface IRegionCommand<E extends SourceError> extends ICommand {
  readonly noun: 'RegionCommand';

  insertAll(regions: Regions): Promise<unknown>;

  deleteAll(): Promise<Try<void, CacheError>>;
}

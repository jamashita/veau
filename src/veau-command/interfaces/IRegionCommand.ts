import { CacheError } from '../../veau-error/CacheError';
import { Try } from '../../veau-general/Try/Try';
import { Regions } from '../../veau-vo/Regions';

export interface IRegionCommand {

  insertAll(regions: Regions): Promise<unknown>;

  deleteAll(): Promise<Try<void, CacheError>>;
}

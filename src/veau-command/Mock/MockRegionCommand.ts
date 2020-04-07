import { CacheError } from '../../veau-error/CacheError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { UnimplementedError } from '../../veau-general/UnimplementedError';
import { Regions } from '../../veau-vo/Regions';
import { IMockCommand } from '../interfaces/IMockCommand';
import { IRegionCommand } from '../interfaces/IRegionCommand';

export class MockRegionCommand implements IRegionCommand, IMockCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async insertAll(regions: Regions): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deleteAll(): Promise<Try<void, CacheError | DataSourceError>> {
    return Promise.reject<Try<void, CacheError | DataSourceError>>(new UnimplementedError());
  }
}
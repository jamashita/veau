import { CacheError } from '../../Error/CacheError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { Regions } from '../../VO/Regions';
import { IMockCommand } from '../Interface/IMockCommand';
import { IRegionCommand } from '../Interface/IRegionCommand';

export class MockRegionCommand implements IRegionCommand, IMockCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public insertAll(regions: Regions): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteAll(): Promise<Try<void, CacheError | DataSourceError>> {
    return Promise.reject<Try<void, CacheError | DataSourceError>>(new UnimplementedError());
  }
}

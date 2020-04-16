import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { UnimplementedError } from '../../General/UnimplementedError';
import { IMockCommand } from '../Interface/IMockCommand';
import { IRegionCommand } from '../Interface/IRegionCommand';

export class MockRegionCommand implements IRegionCommand, IMockCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Mock' = 'Mock';

  public insertAll(): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }

  public deleteAll(): Promise<Try<void, DataSourceError>> {
    return Promise.reject<Try<void, DataSourceError>>(new UnimplementedError());
  }
}

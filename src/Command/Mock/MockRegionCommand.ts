import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { IRegionCommand } from '../Interface/IRegionCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockRegionCommand implements IRegionCommand, IMockCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Mock' = 'Mock';

  public insertAll(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }

  public deleteAll(): Superposition<void, DataSourceError> {
    throw new UnimplementedError();
  }
}

import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore';
import { IRegionCommand } from '../Interface/IRegionCommand';
import { IMockCommand } from './Interface/IMockCommand';

export class MockRegionCommand<E extends DataSourceError = DataSourceError> implements IRegionCommand<E>, IMockCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Mock' = 'Mock';

  public insertAll(): Superposition<void, E> {
    throw new UnimplementedError();
  }

  public deleteAll(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
